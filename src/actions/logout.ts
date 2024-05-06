import { AxiosError } from "axios";
import { Dispatch } from "redux";

import { LOGOUT } from "src/constants/logout";
import { ResponseLogout } from "src/interfaces/logout";
import { API } from "src/utils/API";

export const logout = () => async (dispatch: Dispatch) => {
  return await API.post<ResponseLogout>("/logout")
    .then((response) => {
      const { data } = response;

      dispatch({
        type: LOGOUT,
        payload: data,
      });
    })
    .catch((error) => {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response) {
          const { status } = response;

          if (status === 401) {
            dispatch({
              type: LOGOUT,
              payload: {
                login: false,
                role: '',
              },
            });
          }
        }
      }
    });
};
