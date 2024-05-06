import { STORE_ATTENDEES } from "src/constants/attendees";

const initialState = {
  inserted: false,
};

export const attendees = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case STORE_ATTENDEES:
      return payload;

    default:
      return state;
  }
};
