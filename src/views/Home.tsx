import { Component } from "react";
import { Grid } from "@mui/material";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";

import EventItem from "src/components/EventItem";
import { ResponseEvent } from "src/interfaces/event";
import { getAllEvents } from "src/actions/event";

type HomeProps = {
  events: ResponseEvent[];
  actions: any;
};

type HomeState = {
  events: ResponseEvent[];
};

class Home extends Component<HomeProps, HomeState> {
  state: HomeState = {
    events: [],
  };
  loading: boolean = false;

  async componentDidMount(): Promise<void> {
    if (!this.loading) {
      this.loading = !this.loading;

      await this.loadEvents().then(() => (this.loading = !this.loading));
    }
  }

  async loadEvents() {
    const { actions } = this.props;

    return actions.getAllEvents();
  }

  render() {
    const { events } = this.props;

    return (
      <>
        <Grid container spacing={2}>
          {events.map((event, index) => {
            return (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <EventItem event={event} />
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state: HomeState) => {
  return Object.assign({}, state.events);
};
const actions = {
  getAllEvents,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
