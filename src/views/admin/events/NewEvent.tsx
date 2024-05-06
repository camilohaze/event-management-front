import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { Grid } from "@mui/material";

import { HTTP } from "src/utils/API";
import { RequestEvent } from "src/interfaces/event";
import { ResponseCategory } from "src/interfaces/category";
import { storeEvent, uploadImage } from "src/actions/event";
import { getAllCategories } from "src/actions/category";

import NewEventForm from "src/components/NewEventForm";

type NewEventProps = {
  login: boolean;
  role: string;
  categories?: ResponseCategory[];
  storeEvent?: {
    inserted: boolean;
    eventId: number;
  };
  actions: any;
};

type NewEventState = {
  categories: ResponseCategory[];
  storeEvent: {
    inserted: boolean;
    eventId: number;
  };
};

const NewEvent = (props: NewEventProps) => {
  const { login, role, categories, storeEvent, actions } = props;
  const navigate = useNavigate();
  let loading = useRef<boolean>(false);

  useEffect(() => {
    const admin = (): boolean => {
      return login && role === "admin";
    };

    if (!admin()) {
      navigate("/");

      return;
    }

    if (!loading.current) {
      loading.current = !loading.current;

      actions
        .getAllCategories()
        .then(() => (loading.current = !loading.current));
    }
    return () => {};
  }, [login, role, actions, navigate]);

  const autocompleteLocation = async (textQuery: string) => {
    const headers = {
      "X-Goog-FieldMask": "places.displayName,places.location",
    };

    return HTTP.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery,
      },
      {
        headers,
      }
    );
  };

  const onSubmit = async (event: RequestEvent, file: File) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      actions.storeEvent(event).then((response: any) => {
        const { eventId } = response;

        actions.uploadImage(eventId, formData);
      });
    } catch (error) {
      // code here!
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NewEventForm
            categories={categories}
            autocompleteLocation={autocompleteLocation}
            onSubmit={onSubmit}
          />
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state: NewEventState) => {
  return Object.assign({}, state.categories, state.storeEvent);
};
const actions = {
  getAllCategories,
  storeEvent,
  uploadImage,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewEvent);
