import requests
import sys
import json
from datetime import datetime

class TaskManagementAPITester:
    def __init__(self, base_url="https://task-management-system-nest.vercel.app"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_tasks = []
        self.test_username = f"testuser{datetime.now().strftime('%H%M%S')}"
        self.test_password = "Test@1234"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if data:
            print(f"   Data: {json.dumps(data, indent=2)}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error Response: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_signup(self):
        """Test user signup"""
        success, response = self.run_test(
            "User Signup",
            "POST",
            "user/auth/signup",
            201,
            data={"username": self.test_username, "password": self.test_password}
        )
        return success

    def test_signin(self):
        """Test user signin and get token"""
        success, response = self.run_test(
            "User Signin",
            "POST",
            "user/auth/signin",
            200,
            data={"username": self.test_username, "password": self.test_password}
        )
        if success and 'accessToken' in response:
            self.token = response['accessToken']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_create_task(self, title, description):
        """Create a task"""
        success, response = self.run_test(
            "Create Task",
            "POST",
            "task",
            201,
            data={"title": title, "description": description}
        )
        if success and 'id' in response:
            self.created_tasks.append(response['id'])
            return response['id']
        return None

    def test_get_tasks(self):
        """Get all tasks"""
        success, response = self.run_test(
            "Get All Tasks",
            "GET",
            "task",
            200
        )
        return success, response

    def test_get_tasks_with_filter(self, status):
        """Get tasks with status filter"""
        success, response = self.run_test(
            f"Get Tasks with Status Filter ({status})",
            "GET",
            "task",
            200,
            params={"status": status}
        )
        return success, response

    def test_update_task_status(self, task_id, new_status):
        """Update task status"""
        success, response = self.run_test(
            f"Update Task Status to {new_status}",
            "PATCH",
            f"task/{task_id}",
            200,
            data={"status": new_status}
        )
        return success, response

    def test_delete_task(self, task_id):
        """Delete a task"""
        success, response = self.run_test(
            "Delete Task",
            "DELETE",
            f"task/{task_id}",
            200
        )
        return success

    def test_unauthorized_access(self):
        """Test accessing protected endpoints without token"""
        original_token = self.token
        self.token = None
        
        success, _ = self.run_test(
            "Unauthorized Access to Tasks",
            "GET",
            "task",
            401
        )
        
        self.token = original_token
        return success

def main():
    print("🚀 Starting Task Management API Tests")
    print("=" * 50)
    
    tester = TaskManagementAPITester()
    
    # Test 1: User Signup
    if not tester.test_signup():
        print("❌ Signup failed, stopping tests")
        return 1

    # Test 2: User Signin
    if not tester.test_signin():
        print("❌ Signin failed, stopping tests")
        return 1

    # Test 3: Unauthorized access
    if not tester.test_unauthorized_access():
        print("❌ Unauthorized access test failed")

    # Test 4: Create tasks
    task1_id = tester.test_create_task(
        "Test Task 1",
        "This is a test task for API testing purposes"
    )
    if not task1_id:
        print("❌ Task creation failed, stopping tests")
        return 1

    task2_id = tester.test_create_task(
        "Test Task 2",
        "Another test task with different content"
    )

    # Test 5: Get all tasks
    success, tasks_data = tester.test_get_tasks()
    if not success:
        print("❌ Get tasks failed")

    # Test 6: Update task status
    if task1_id:
        success, updated_task = tester.test_update_task_status(task1_id, "IN_PROGRESS")
        if not success:
            print("❌ Update task status failed")

    # Test 7: Filter tasks by status
    success, filtered_tasks = tester.test_get_tasks_with_filter("IN_PROGRESS")
    if not success:
        print("❌ Filter tasks failed")

    # Test 8: Update task to DONE
    if task1_id:
        success, updated_task = tester.test_update_task_status(task1_id, "DONE")
        if not success:
            print("❌ Update task to DONE failed")

    # Test 9: Delete tasks (cleanup)
    for task_id in tester.created_tasks:
        if not tester.test_delete_task(task_id):
            print(f"❌ Failed to delete task {task_id}")

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())