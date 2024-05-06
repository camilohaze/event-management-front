import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  Backdrop,
  CircularProgress,
  Snackbar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from "@mui/material";
import { MD5 } from "crypto-js";
import { AxiosError } from "axios";

import {
  isRequired,
  isEmail,
  minLength,
  maxLength,
} from "src/utils/Validators";
import { RequestLogin } from "src/interfaces/login";
import Transition from "./Transition";

type LoginProps = {
  onSubmit: any;
};

const LoginForm = (props: LoginProps) => {
  const navigate = useNavigate();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { onSubmit } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({
      username: "",
      password: "",
    });

    return () => {};
  }, [reset]);

  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onLogin = async (form: RequestLogin) => {
    let { username, password } = form;

    handleOpenBackdrop();

    try {
      password = MD5(password).toString();

      await onSubmit({
        username,
        password,
      });

      reset({
        username: "",
        password: "",
      });

      handleOpenSnackbar();
      navigate({ pathname: "/" });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response) {
          const { status } = response;

          if (status === 404) {
            handleOpenDialog();
          }
        }
      }
    }

    handleCloseBackdrop();
  };

  return (
    <>
      <Card variant={"outlined"}>
        <CardContent>
          <Stack spacing={3}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    type={"email"}
                    label={"Username"}
                    variant={"outlined"}
                    value={value}
                    error={!!errors.username}
                    helperText={errors.username && errors.username.message}
                    onChange={(username) => {
                      onChange(username);
                      trigger("username");
                    }}
                  />
                </>
              )}
              name={"username"}
              defaultValue={""}
              rules={{ ...isRequired, ...isEmail }}
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    type={"password"}
                    label={"Password"}
                    variant={"outlined"}
                    value={value}
                    error={!!errors.password}
                    helperText={errors.password && errors.password.message}
                    onChange={(password) => {
                      onChange(password);
                      trigger("password");
                    }}
                  />
                </>
              )}
              name={"password"}
              defaultValue={""}
              rules={{
                ...isRequired,
                ...minLength(8),
                ...maxLength(25),
              }}
            />

            <Button variant="contained" onClick={handleSubmit(onLogin)}>
              Iniciar sesión
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Sesión iniciada!"
      />
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Usuario o contraseña incorrecta.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginForm;
