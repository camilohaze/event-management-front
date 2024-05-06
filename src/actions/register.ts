import { Dispatch } from "redux";

import { REGISTER } from "src/constants/register";
import { RequestRegister, ResponseRegister } from "src/interfaces/register";
import { API } from "src/utils/API";

export const register = (user: RequestRegister) => async (dispatch: Dispatch) => {
  return await API.post<ResponseRegister>("/register", user).then((response) => {
    const { data } = response;

    dispatch({
      type: REGISTER,
      payload: data,
    });
  });
};
