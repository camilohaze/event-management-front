import { Dispatch } from "redux";
import {
  GET_EVENTS,
  GET_EVENTS_USER,
  GET_EVENT,
  STORE_EVENT,
  UPDATE_EVENT,
  REMOVE_EVENT,
  UPLOAD_EVENTS,
} from "src/constants/event";
import {
  RequestEvent,
  ResponseDeleteEvent,
  ResponseEvent,
  ResponseStoreEvent,
  ResponseUpdateEvent,
  ResponseUploadEvents,
} from "src/interfaces/event";
import { API } from "src/utils/API";

export const getAllEvents = () => async (dispatch: Dispatch) => {
  return await API.get<ResponseEvent[]>("/events").then((response) => {
    const { data } = response;

    dispatch({
      type: GET_EVENTS,
      payload: data,
    });
  });
};

export const getEventById = (eventId: number) => async (dispatch: Dispatch) => {
  return await API.get<ResponseEvent>(`/events/${eventId}`)
    .then((response) => {
      const { data } = response;

      dispatch({
        type: GET_EVENT,
        payload: data,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_EVENT,
        payload: null,
      });

      throw error;
    });
};

export const getByUserId = () => async (dispatch: Dispatch) => {
  return await API.post<ResponseEvent[]>("/events/user").then((response) => {
    const { data } = response;

    dispatch({
      type: GET_EVENTS_USER,
      payload: data,
    });
  });
};

export const storeEvent = (event: RequestEvent) => async (dispatch: Dispatch) => {
  return await API.post<ResponseStoreEvent>("/events", event).then(
    (response) => {
      const { data } = response;

      dispatch({
        type: STORE_EVENT,
        payload: data,
      });

      return data;
    }
  );
};

export const updateEvent =
  (event: RequestEvent) => async (dispatch: Dispatch) => {
    return await API.put<ResponseUpdateEvent>("/events", event).then(
      (response) => {
        const { data } = response;

        dispatch({
          type: UPDATE_EVENT,
          payload: data,
        });
      }
    );
  };

export const removeEvent = (eventId: number) => async (dispatch: Dispatch) => {
  return await API.delete<ResponseDeleteEvent>(`/events/${eventId}`).then(
    (response) => {
      const { data } = response;

      dispatch({
        type: REMOVE_EVENT,
        payload: data,
      });
    }
  );
};

export const uploadImage =
  (eventId: number, formData: FormData) => async (dispatch: Dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    return await API.post<ResponseUploadEvents>(
      `/events/upload/${eventId}`,
      formData,
      {
        headers,
      }
    ).then((response) => {
      const { data } = response;

      dispatch({
        type: UPLOAD_EVENTS,
        payload: data,
      });
    });
  };

export const uploadEvents = (body: FormData) => async (dispatch: Dispatch) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return await API.post<ResponseUploadEvents>("/events/import", body, {
    headers,
  }).then((response) => {
    const { data } = response;

    dispatch({
      type: UPLOAD_EVENTS,
      payload: data,
    });
  });
};
