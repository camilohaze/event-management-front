import { Dispatch } from "redux";

import { LOGIN } from "src/constants/login";
import { RequestLogin, ResponseLogin } from "src/interfaces/login";
import { API } from "src/utils/API";

export const login = (user: RequestLogin) => async (dispatch: Dispatch) => {
  return await API.post<ResponseLogin>("/login", user).then((response) => {
    const { data } = response;

    dispatch({
      type: LOGIN,
      payload: data,
    });
  });
};
