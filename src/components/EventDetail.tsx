import { PureComponent, ReactNode, createRef } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import MapTwoTone from "@mui/icons-material/MapTwoTone";
import ScheduleTwoTone from "@mui/icons-material/ScheduleTwoTone";
import DoorSlidingTwoTone from "@mui/icons-material/DoorSlidingTwoTone";
import EighteenUpRatingTwoTone from "@mui/icons-material/EighteenUpRatingTwoTone";
import AccessibleTwoTone from "@mui/icons-material/AccessibleTwoTone";
import LocalOfferTwoTone from "@mui/icons-material/LocalOfferTwoTone";
import mapboxgl from "mapbox-gl";
import moment from "moment";
import "moment/locale/es";

import { HTTP } from "src/utils/API";
import { ResponseEvent } from "src/interfaces/event";
import Div from "./Div";
import Transition from "./Transition";
import EventNotFound from "./EventNotFound";

interface EventDetailProps {
  login: boolean;
  event?: ResponseEvent;
  getEventById: any;
}

interface EventDetailState {
  zoom: number;
  places: any[];
  dialog: boolean;
  checked: number[];
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FtaWxvaGF6ZSIsImEiOiJjbHZwNzJkZnowMXhlMm5tY3lzeThheHpxIn0.8tXkw_2VEA7lhdSpb11Fwg";

class EventDatail extends PureComponent<EventDetailProps, EventDetailState> {
  state: EventDetailState = {
    zoom: 15,
    places: [],
    dialog: false,
    checked: [],
  };

  loading: boolean = false;
  mapContainer: any;
  map: any;
  market: any;

  constructor(props: EventDetailProps) {
    super(props);

    this.mapContainer = createRef<any>();
    this.map = createRef<any>();
  }

  async componentDidMount(): Promise<void> {
    if (!this.loading) {
      this.loading = !this.loading;

      await this.getEventData();
    }
  }

  getEventData = async () => {
    try {
      await this.getEventById();
      this.mapBox();
      await this.nearbyPlaces();
    } catch {
      // code here!
    }
  };

  getEventById = async () => {
    const { getEventById } = this.props;

    return await getEventById();
  };

  mapBox = () => {
    if (this.map.current) return;

    const { event } = this.props;

    if (event) {
      const { latitude, longitude } = event;

      this.map.current = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [+longitude, +latitude],
        zoom: this.state.zoom,
      });

      this.market = new mapboxgl.Marker({ color: "black", rotation: 45 })
        .setLngLat([+longitude, +latitude])
        .addTo(this.map.current);
    }
  };

  nearbyPlaces = async () => {
    const { event } = this.props;

    if (event) {
      const { latitude, longitude } = event;

      const body = {
        includedTypes: ["restaurant", "liquor_store", "convenience_store"],
        maxResultCount: 5,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            radius: 300,
          },
        },
      };

      const headers = {
        "X-Goog-FieldMask": "places.*",
      };

      await HTTP.post(
        "https://places.googleapis.com/v1/places:searchNearby",
        body,
        {
          headers,
        }
      ).then((response) => {
        const {
          data: { places },
        } = response;

        if (places.length > 0) {
          this.setState({ places });
        }
      });
    }
  };

  handleOpenDialog = () => {
    this.setState({ dialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialog: false, checked: [] });
  };

  handleToggle = (value: number) => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked });
  };

  startTime = (): string => {
    const { event } = this.props;

    if (event) {
      return moment(event.startTime, "hh:mm:ss").format("hh:mm a");
    }

    return "";
  };

  openingTime = (): string => {
    const { event } = this.props;

    if (event) {
      return moment(event.openingTime, "hh:mm:ss").format("hh:mm a");
    }

    return "";
  };

  minimumAge = (): string => {
    const { event } = this.props;

    if (event) {
      return event.minimumAge ? "+18" : "n/a";
    }

    return "";
  };

  specialZone = (): string => {
    const { event } = this.props;

    if (event) {
      return event.specialZone ? "Diponible" : "n/a";
    }

    return "";
  };

  disabledAttendees = (): boolean => {
    const { login } = this.props;

    return !!login;
  };

  render(): ReactNode {
    const { login, event } = this.props;
    const { places, checked, dialog } = this.state;

    return (
      <>
        {event ? (
          <>
            <Card variant={"outlined"}>
              <CardMedia
                component="img"
                height="300"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={8}>
                    <Stack spacing={1}>
                      <Typography variant={"h4"}>{event.title}</Typography>

                      <Typography
                        title={event.description}
                        variant="body1"
                        color="text.secondary"
                        style={{
                          textAlign: "justify",
                        }}
                      >
                        {event.description}
                      </Typography>

                      <div
                        ref={this.mapContainer}
                        className="map-container"
                        id="map"
                      ></div>

                      <Typography variant={"h6"}>Lugares cercanos</Typography>

                      {places.map((place: any, index: number) => {
                        return (
                          <Grid
                            item
                            key={index}
                            xs={12}
                            style={{ padding: 0, margin: 0 }}
                          >
                            <List dense style={{ padding: 0, margin: 0 }}>
                              <ListItem>
                                <ListItemButton
                                  href={place.googleMapsUri}
                                  target={"_blank"}
                                >
                                  <ListItemText
                                    primary={place.displayName.text}
                                    secondary={place.shortFormattedAddress}
                                  />
                                </ListItemButton>
                              </ListItem>
                            </List>
                            <Divider />
                          </Grid>
                        );
                      })}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={1}>
                      <Typography
                        title={"Descripción"}
                        variant={"h6"}
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Información detallada
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <MapTwoTone style={{ fontSize: 48 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Ubicación"}
                            secondary={event.location}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <ScheduleTwoTone style={{ fontSize: 48 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Hora de Inicio"}
                            secondary={this.startTime()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <DoorSlidingTwoTone style={{ fontSize: 48 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Apertura Puertas"}
                            secondary={this.openingTime()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <EighteenUpRatingTwoTone style={{ fontSize: 48 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Edad mínima"}
                            secondary={this.minimumAge()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <AccessibleTwoTone style={{ fontSize: 48 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Accesibilidad"}
                            secondary={this.specialZone()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <LocalOfferTwoTone style={{ fontSize: 48 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Categoria del evento"}
                            secondary={event.category}
                          />
                        </ListItem>
                      </List>
                      <Button
                        variant="contained"
                        disabled={!login}
                        onClick={() => this.handleOpenDialog()}
                      >
                        Asistir
                      </Button>
                      {!login && (
                        <Div>
                          {
                            "Debes registrar e ingresar para poder asistir a los eventos"
                          }
                        </Div>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Dialog
              fullWidth
              open={dialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseDialog()}
            >
              <DialogTitle textAlign={"center"}>Seleccionar fechas</DialogTitle>
              <DialogContent>
                <Stack spacing={3}>
                  <List dense>
                    {event.dates.map((item: any, index: number) => {
                      const labelId = `checkbox-list-secondary-label-${index}`;
                      const date = moment(item.date);
                      const yesterday = moment().subtract(1, "day");
                      const disabled = yesterday.isSameOrAfter(date);

                      return (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <Checkbox
                              edge="end"
                              checked={checked.indexOf(item.id) !== -1}
                              inputProps={{ "aria-labelledby": labelId }}
                              onChange={this.handleToggle(item.id)}
                              disabled={disabled}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton
                            disabled={disabled}
                            onClick={this.handleToggle(item.id)}
                          >
                            <ListItemText
                              id={labelId}
                              primary={`${moment(item.date).format(
                                "D [de] MMMM [del] YYYY"
                              )}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  variant={"text"}
                  onClick={() => this.handleCloseDialog()}
                >
                  Cancelar
                </Button>
                <Button
                  variant={"contained"}
                  onClick={() => this.handleCloseDialog()}
                >
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <>
            <EventNotFound />
          </>
        )}
      </>
    );
  }
}

export default EventDatail;
