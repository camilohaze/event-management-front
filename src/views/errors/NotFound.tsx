import {
  Grid,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
}));

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Card variant={"outlined"}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={3} />
            <Grid item xs={12} sm={6} md={6}>
              <Stack spacing={1}>
                <Typography variant="h3">La página no existe!</Typography>
                <Div style={{ marginTop: 20 }}>¿Te encuentras perdido?</Div>
                <Div>Rapido, vuelve con nosotros</Div>
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

export default NotFound;
