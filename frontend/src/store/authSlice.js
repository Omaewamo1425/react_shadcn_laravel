const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  token: tokenFromStorage || null,
  user: null,
  permissions: [],
  loading: true,
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
        loading: false, 
      };
    }

    case "auth/clear":
      localStorage.removeItem("token");
      return { token: null, user: null, permissions: [], loading: false, };

    default:
      return state;


    case "auth/setLoading":
    return {
      ...state,
    };
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

export const setLoading = (isLoading) => ({
  type: "auth/setLoading",
  payload: isLoading,
});