import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { Grid, Stack } from "@mui/material";

import { getEventById } from "src/actions/event";
import { ResponseEvent } from "src/interfaces/event";

import EventDatail from "src/components/EventDetail";

type EventProps = {
  login: boolean;
  event?: ResponseEvent;
  actions: any;
};

type EventState = {
  event: ResponseEvent;
};

type EventParams = {
  eventId: string;
};

const Event = (props: EventProps) => {
  const { actions, login, event } = props;
  const { eventId } = useParams<EventParams>();

  useEffect(() => {
    return () => {};
  }, []);

  const getEventById = async () => {
    await actions.getEventById(eventId);
  };

  return (
    <>
      <Stack direction={"row"} spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EventDatail
              login={login}
              event={event}
              getEventById={getEventById}
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

const mapStateToProps = (state: EventState) => {
  return Object.assign({}, state.event);
};
const actions = {
  getEventById,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Event);
