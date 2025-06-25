const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  token: tokenFromStorage || null,
  user: null,
  permissions: [],
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "auth/setToken":
      return { ...state, token: action.payload };

    case "auth/setUser": {
      const { roles = [] } = action.payload;

      // Flatten all permissions from all roles (if you expect multiple roles)
      const permissions = roles.flatMap(role => role.permissions || []);

      return {
        ...state,
        user: action.payload,
        permissions,
      };
    }

    case "auth/clear":
      localStorage.removeItem("token");
      return { token: null, user: null, permissions: [] };

    default:
      return state;
  }
}

export const setToken = (token) => {
  localStorage.setItem("token", token);
  return { type: "auth/setToken", payload: token };
};

export const setUser = (user) => ({
  type: "auth/setUser",
  payload: user,
});

export const clearAuth = () => {
  localStorage.removeItem("token");
  return { type: "auth/clear" };
};
