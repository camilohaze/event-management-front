import {
  GET_EVENTS,
  GET_EVENTS_USER,
  GET_EVENT,
  STORE_EVENT,
  UPDATE_EVENT,
  REMOVE_EVENT,
  UPLOAD_EVENTS,
} from "src/constants/event";

const eventsState = {
  events: [],
};

export const events = (state = eventsState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_EVENTS:
      return {
        events: payload,
      };

    default:
      return state;
  }
};

const userEventsState = {
  userEvents: [],
};

export const userEvents = (state = userEventsState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_EVENTS_USER:
      return {
        userEvents: payload,
      };

    default:
      return state;
  }
};

const eventState = {
  event: null,
};

export const event = (state = eventState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_EVENT:
      return {
        event: payload,
      };

    default:
      return state;
  }
};

const storeEventState = {
  inserted: false,
  eventId: 0
};

export const storeEvent = (state = storeEventState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case STORE_EVENT:
      return payload;

    default:
      return state;
  }
};

const updateEventState = {
  updated: false,
};

export const updateEvent = (state = updateEventState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EVENT:
      return payload;

    default:
      return state;
  }
};

const deleteEventState = {
  deleted: false,
};

export const deleteEvent = (state = deleteEventState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case REMOVE_EVENT:
      return payload;

    default:
      return state;
  }
};

const uploadImageState = {
  uploaded: false,
};

export const uploadImage = (state = uploadImageState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_EVENTS:
      return payload;

    default:
      return state;
  }
};

const uploadEventsState = {
  error: false,
  imported: {
    quantity: 0,
    success: [],
    failed: [],
  },
};

export const uploadEvents = (state = uploadEventsState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_EVENTS:
      return payload;

    default:
      return state;
  }
};
