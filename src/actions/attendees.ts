import { Dispatch } from "redux";

import { STORE_ATTENDEES } from "src/constants/attendees";
import { RequestAttendees, ResponseAttendees } from "src/interfaces/attendees";
import { API } from "src/utils/API";

export const store = (attendees: RequestAttendees) => async (dispatch: Dispatch) => {
  return await API.post<ResponseAttendees>("/attendees", attendees).then((response) => {
    const { data } = response;

    dispatch({
      type: STORE_ATTENDEES,
      payload: data,
    });
  });
};
