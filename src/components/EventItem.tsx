import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import MapTwoTone from "@mui/icons-material/MapTwoTone";
import CalendarTodayTwoTone from "@mui/icons-material/CalendarTodayTwoTone";
import moment from "moment";
import "moment/locale/es";

import { ResponseEvent } from "src/interfaces/event";

type EventItemProps = {
  event: ResponseEvent;
};

const EventItem = (props: EventItemProps) => {
  moment.locale("es");

  const { event } = props;
  let { id, title, description, location } = event;
  const navigate = useNavigate();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <Card variant={"outlined"}>
        <CardMedia
          component="img"
          height="250"
          image="https://placehold.co/600x400"
          alt={title}
        />
        <CardContent>
          <Stack spacing={1}>
            <Typography
              title={title}
              variant={"h5"}
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {title}
            </Typography>

            <Typography
              title={location}
              variant={"body2"}
              style={{
                display: "flex",
                alignItems: "self-end",
                textAlign: "left",
              }}
            >
              <MapTwoTone style={{ marginRight: 5 }} /> {location}
            </Typography>

            <Typography
              title={description}
              variant="body2"
              color="text.secondary"
              style={{
                textAlign: "justify",
              }}
            >
              {description}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/event-detail/${id}`)}
          >
            VER DETALLE
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default EventItem;
