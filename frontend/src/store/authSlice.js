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
      const permissions = roles.length > 0 ? roles[0].permissions || [] : [];

      return {
        ...state,
        user: action.payload,
        permissions,
      };
    }



    case "auth/clear":
      return { token: null, user: null, permissions: [] };

    default:
      return state;
  }
}

export const setToken = (token) => {
  localStorage.setItem("token", token); 
  return { type: "auth/setToken", payload: token };
};

// export const setUser = (user) => ({
//   type: "auth/setUser",
//   payload: user,
// });

export const setUser = (user) => ({
  type: "auth/setUser",
  payload: user,
});


export const clearAuth = () => {
  localStorage.removeItem("token"); 
  return { type: "auth/clear" };
};
