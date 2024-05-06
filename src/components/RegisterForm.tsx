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
  alpha,
  number,
} from "src/utils/Validators";
import { RequestRegister } from "src/interfaces/register";
import Transition from "./Transition";

type RegisterProps = {
  onSubmit: any;
};

const RegisterForm = (props: RegisterProps) => {
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
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  useEffect(() => {
    reset({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
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

  const onRegister = async (form: RequestRegister) => {
    let { username, password, firstName, lastName, phone } = form;

    handleOpenBackdrop();

    try {
      password = MD5(password).toString();

      await onSubmit({
        username,
        password,
        firstName,
        lastName,
        phone,
      });

      reset({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
      });

      handleOpenSnackbar();
      navigate({ pathname: "/login" });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response) {
          const { status } = response;

          if (status === 422) {
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

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    type={"text"}
                    label={"Nombres"}
                    variant={"outlined"}
                    value={value}
                    error={!!errors.firstName}
                    helperText={errors.firstName && errors.firstName.message}
                    onChange={(firstName) => {
                      onChange(firstName);
                      trigger("firstName");
                    }}
                  />
                </>
              )}
              name={"firstName"}
              defaultValue={""}
              rules={{
                ...isRequired,
                ...alpha,
              }}
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    type={"text"}
                    label={"Apellidos"}
                    variant={"outlined"}
                    value={value}
                    error={!!errors.lastName}
                    helperText={errors.lastName && errors.lastName.message}
                    onChange={(lastName) => {
                      onChange(lastName);
                      trigger("lastName");
                    }}
                  />
                </>
              )}
              name={"lastName"}
              defaultValue={""}
              rules={{
                ...isRequired,
                ...alpha,
              }}
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    type={"text"}
                    label={"Teléfono"}
                    variant={"outlined"}
                    value={value}
                    error={!!errors.phone}
                    helperText={errors.phone && errors.phone.message}
                    onChange={(phone) => {
                      onChange(phone);
                      trigger("phone");
                    }}
                  />
                </>
              )}
              name={"phone"}
              defaultValue={""}
              rules={{
                ...isRequired,
                ...number,
              }}
            />

            <Button variant="contained" onClick={handleSubmit(onRegister)}>
              Registrarme
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
        message="Usuario registrado!"
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
            El corre electrónico ya se encuentra registrado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterForm;
