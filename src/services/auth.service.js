import api from "./api";

export const authService = {
  signup: async (username, password) => {
    const response = await api.post("/auth/signup", {
      username: username.trim().toLowerCase(),
      password,
    });
    return response.data;
  },

  signin: async (username, password) => {
    try {
      const response = await api.post("/auth/signin", {
        username: username.trim().toLowerCase(),
        password,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getUsername: () => {
    return localStorage.getItem("username");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
