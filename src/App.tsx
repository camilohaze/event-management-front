import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import {
  AppBar,
  Container,
  Box,
  Grid,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Divider,
  Backdrop,
  CircularProgress,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ManageAccountsTwoTone from "@mui/icons-material/ManageAccountsTwoTone";
import ListTwoTone from "@mui/icons-material/ListTwoTone";
import EventTwoTone from "@mui/icons-material/EventTwoTone";

import { logout } from "src/actions/logout";

import NotFound from "src/views/errors/NotFound";

import Home from "src/views/Home";
import Login from "src/views/Login";
import Register from "src/views/Register";

import Event from "src/views/Event";

import ListCategories from "src/views/admin/categories/ListCategories";

import ListEvents from "src/views/admin/events/ListEvents";
import EditEvent from "src/views/admin/events/EditEvent";
import NewEvent from "src/views/admin/events/NewEvent";

import "./App.css";

type AppProps = {
  login: boolean;
  role: string;
  actions: any;
};

type AppState = {
  auth: {
    login: boolean;
    role: string;
  };
};

const App = (props: AppProps) => {
  const { login, role, actions } = props;
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const onLogout = async () => {
    handleOpenBackdrop();

    await actions.logout();

    handleCloseBackdrop();
  };

  const admin = (): boolean => {
    return role.includes("admin");
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Stack spacing={1}>
        <List>
          <ListItem disablePadding>
            <ListItemText
              primary={"Menu"}
              primaryTypographyProps={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ListTwoTone />
              </ListItemIcon>
              <ListItemText
                primary={"Categorias"}
                primaryTypographyProps={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                onClick={() => navigate("/admin/categories")}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <EventTwoTone />
              </ListItemIcon>
              <ListItemText
                primary={"Eventos"}
                primaryTypographyProps={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                onClick={() => navigate({ pathname: "/admin/events" })}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Box>
  );

  return (
    <div className="App">
      <Box position={"static"} sx={{ flexGrow: 1, width: "100%" }}>
        <AppBar position={"static"} enableColorOnDark={false}>
          <Toolbar>
            {admin() && (
              <>
                <IconButton
                  size={"large"}
                  edge={"start"}
                  color={"inherit"}
                  aria-label={"menu"}
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Button
                color="inherit"
                sx={{
                  display: "flex",
                  width: "auto",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => navigate({ pathname: "/" })}
              >
                Eventos
              </Button>
            </Box>
            {login ? (
              <>
                <Button color="inherit" onClick={() => onLogout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate({ pathname: "/login" })}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate({ pathname: "/register" })}
                >
                  Register
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Container sx={{ flexGrow: 1, marginTop: 5, marginBottom: 5 }}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Routes>
                <Route path={"*"} element={<NotFound />} />
                <Route path={"/"} element={<Home events={[]}/>} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/register"} element={<Register />} />

                <Route
                  path={"/event-detail/:eventId"}
                  element={<Event login={login} />}
                />

                <Route
                  path={"/admin/categories"}
                  element={
                    <ListCategories role={role} login={login} categories={[]} />
                  }
                />

                <Route
                  path={"/admin/events"}
                  element={
                    <ListEvents role={role} login={login} userEvents={[]} />
                  }
                />
                <Route
                  path={"/admin/events/new"}
                  element={<NewEvent role={role} login={login} />}
                />
                <Route
                  path={"/admin/events/edit"}
                  element={<EditEvent role={role} login={login} />}
                />
              </Routes>
            </Grid>
          </Grid>
        </Box>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
          onClick={handleCloseBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return Object.assign({}, state.auth);
};
const actions = {
  logout,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
