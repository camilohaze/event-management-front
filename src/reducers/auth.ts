import { LOGIN } from "src/constants/login";
import { LOGOUT } from "src/constants/logout";

const initialState = {
  login: false,
  role: '',
};

export const auth = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      return payload;

    case LOGOUT:
      return payload;

    default:
      return state;
  }
};
