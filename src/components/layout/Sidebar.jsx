// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { LayoutDashboard, Plus, LogOut, User, CheckSquare } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate('/signin');
//   };

//   const navItems = [
//     {
//       label: 'Dashboard',
//       path: '/dashboard',
//       icon: LayoutDashboard,
//     },
//     {
//       label: 'Create Task',
//       path: '/tasks/create',
//       icon: Plus,
//     },
//   ];

//   return (
//     <aside className="w-64 bg-white border-r border-slate-200 flex flex-col" data-testid="sidebar">
//       <div className="p-6 border-b border-slate-200">
//         <div className="flex items-center gap-2">
//           <CheckSquare className="w-8 h-8 text-slate-900" strokeWidth={2} />
//           <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
//             TaskWiz
//           </h1>
//         </div>
//       </div>

//       <nav className="flex-1 p-4 space-y-2">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;
//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
//               className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-medium ${
//                 isActive
//                   ? 'bg-slate-900 text-white shadow-sm'
//                   : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
//               }`}
//             >
//               <Icon className="w-5 h-5" strokeWidth={2} />
//               <span>{item.label}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-slate-200 space-y-3">
//         <div className="flex items-center gap-3 px-4 py-2">
//           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
//             <User className="w-4 h-4 text-slate-600" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-slate-900 truncate">{user?.username}</p>
//             <p className="text-xs text-slate-500">User</p>
//           </div>
//         </div>
//         <Button
//           variant="ghost"
//           onClick={handleLogout}
//           data-testid="logout-button"
//           className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100"
//         >
//           <LogOut className="w-5 h-5 mr-3" strokeWidth={2} />
//           Logout
//         </Button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;



import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Plus, LogOut, User, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Create Task',
      path: '/tasks/create',
      icon: Plus,
    },
  ];

  return (
    <aside className="w-16 lg:w-64 bg-white border-r border-slate-200 flex flex-col" data-testid="sidebar">
      <div className="flex items-center justify-center lg:justify-start gap-1 lg:gap-2 p-3 lg:p-6 border-b border-slate-200">
        <CheckSquare className="w-6 h-6 lg:w-8 lg:h-8 text-slate-900 flex-shrink-0" strokeWidth={2} />
        <h1 className="hidden lg:block text-2xl font-bold text-slate-900 truncate" style={{ fontFamily: 'Manrope, sans-serif' }}>
          TaskWiz
        </h1>
      </div>

      <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              className={`group flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-md transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 lg:p-4 border-t border-slate-200 space-y-2 lg:space-y-3">
        <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="hidden lg:flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500">User</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          data-testid="logout-button"
          className="w-full h-11 lg:h-auto justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
          <span className="hidden lg:inline">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;