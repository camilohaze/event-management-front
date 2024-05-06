import {
  Grid,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Card variant={"outlined"}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={3} />
            <Grid item xs={12} sm={6} md={6}>
              <Stack spacing={1}>
                <Typography variant="h3">El evento no existe!</Typography>
              </Stack>
              <Button
                variant="outlined"
                style={{ marginTop: 20 }}
                onClick={() => navigate("/")}
              >
                Vuelve al Inicio
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default EventNotFound;
