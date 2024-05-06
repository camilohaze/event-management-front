import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";

import { Grid } from "@mui/material";

import { HTTP } from "src/utils/API";

import { RequestEvent } from "src/interfaces/event";
import { ResponseCategory } from "src/interfaces/category";
import { updateEvent, uploadImage } from "src/actions/event";
import { getAllCategories } from "src/actions/category";

import EditEventForm from "src/components/EditEventForm";

type EditEventProps = {
  login: boolean;
  role: string;
  categories?: ResponseCategory[];
  actions: any;
};

type EditEventState = {
  categories: ResponseCategory[];
};

const EditEvent = (props: EditEventProps) => {
  const { login, role, categories, actions } = props;
  const { state } = useLocation();
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
  }, [state, login, role, actions, navigate]);

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

      await actions.updateEvent(event);
      await actions.uploadImage(event.id, formData);
    } catch (error) {
      // code here!
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <EditEventForm
            event={state}
            categories={categories}
            autocompleteLocation={autocompleteLocation}
            onSubmit={onSubmit}
          />
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state: EditEventState) => {
  return Object.assign({}, state.categories);
};
const actions = {
  getAllCategories,
  updateEvent,
  uploadImage,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEvent);
