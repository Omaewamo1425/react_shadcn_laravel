const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  token: tokenFromStorage || null,
  user: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "auth/setToken":
      return { ...state, token: action.payload };

    case "auth/setUser":
      return { ...state, user: action.payload };

    case "auth/clear":
      return { token: null, user: null };

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
