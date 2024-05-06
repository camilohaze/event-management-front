import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormHelperText,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop,
  CircularProgress,
  Snackbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import {
  LocalizationProvider,
  TimePicker,
  DateCalendar,
} from "@mui/x-date-pickers-pro";

import { AdapterMoment } from "@mui/x-date-pickers-pro/AdapterMoment";
import moment, { Moment } from "moment";
import "moment/locale/es";
import { AxiosError } from "axios";

import { isRequired, maxLength } from "src/utils/Validators";

import { RequestEvent } from "src/interfaces/event";
import { ResponseCategory } from "src/interfaces/category";

import Transition from "src/components/Transition";
import VisuallyHiddenInput from "src/components/VisuallyHiddenInput";
import Div from "./Div";

type EditEventFormProps = {
  categories?: ResponseCategory[];
  onSubmit: Function;
  autocompleteLocation: any;
};

const NewEventForm = (props: EditEventFormProps) => {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [startTimeDate, setStartTimeDate] = useState<Moment | null>(moment());
  const [openingTimeDate, setOpeningTimeDate] = useState<Moment | null>(
    moment()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);
  const [searcher, setSearcher] = useState("");
  const [file, setFile] = useState<File | null>();
  const [preview, setPreview] = useState("");
  const [dates, setDates] = useState<any[]>([]);
  const [calendar] = useState<Moment>(moment());
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      openingTime: "",
      minimumAge: false,
      specialZone: false,
      location: "",
      latitude: "0",
      longitude: "-1",
      categoryId: "",
      calendar: null,
      images: "",
    },
  });
  const navigate = useNavigate();
  const defaultImage = "http://localhost:3000/uploads/400x200.png";
  let { categories, autocompleteLocation, onSubmit } = props;

  useEffect(() => {
    return () => {};
  }, [reset, setValue, calendar]);

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

  const onChangeInput = (value: string, onChange: any, input: any) => {
    onChange(value);
    trigger(input);
  };

  const shouldDisableDate = (day: Moment): boolean => {
    const date = day.format("YYYY-MM-DD");
    const exists = dates.find((item: any) => item.date === date);

    return !!exists;
  };

  const onChangeCalendar = (day: Moment, onChange: any) => {
    const newDates = [...dates];
    const newDate = {
      date: day.format("YYYY-MM-DD"),
    };

    newDates.push(newDate);

    onChange(day);
    trigger("calendar");

    setDates(newDates);
  };

  const onChangeCategory = (value: string, onChange: any, input: any) => {
    const item = categories?.find((p) => p.name === value);

    if (item) {
      setSelectedCategory(item.name);
      onChange(item.id);
      trigger("categoryId");
    }
  };

  const onChangeSearcher = (value: string) => {
    setSearcher(value);
    autocomplete(value);
  };

  const onChangeAutocomplete = (option: any, reason: string, onChange: any) => {
    switch (reason) {
      case "selectOption":
        onChange(option.label);

        setValue("latitude", option.coordinates.latitude);
        setValue("longitude", option.coordinates.longitude);

        setSearcher("");
        break;

      case "clear":
        onChange("");

        setValue("latitude", "");
        setValue("longitude", "");

        setSearcher("");
        break;

      default:
        // code here!
        break;
    }

    trigger("location");
  };

  const onChangeTime = (time: Moment | null, onChange: any, input: any) => {
    if (time) {
      switch (input) {
        case "startTime":
          setStartTimeDate(time);
          break;

        default:
          setOpeningTimeDate(time);
          break;
      }

      onChange(time.format("HH:mm"));
      trigger(input);
    }
  };

  const onChangeSwitch = (checked: boolean, onChange: Function, input: any) => {
    onChange(checked);
    trigger(input);
  };

  const autocomplete = async (input: string) => {
    try {
      if (input.length > 3) {
        await autocompleteLocation(input).then((response: any) => {
          const {
            data: { places },
          } = response;

          if (!!places && places.length > 0) {
            setOptions(
              places.map((place: any) => {
                const {
                  displayName: { text },
                  location,
                } = place;

                return {
                  label: text,
                  coordinates: location,
                };
              })
            );
          }
        });
      }
    } catch (error) {
      // code here!
    }
  };

  const selectFile = (event: any) => {
    const {
      target: { files },
    } = event;

    setFile(files[0]);
    setPreview(URL.createObjectURL(files[0]));
  };

  const cleanFile = () => {
    setFile(null);
    setPreview("");
  };

  const removeDate = (item: any) => {
    const dateIndex = dates.findIndex((p: any) => p.date === item.date);
    const newDates = [...dates];

    newDates.splice(dateIndex, 1);

    setDates(newDates);

    if (!newDates.length) {
      setValue("calendar", null);
      trigger("calendar");
    }
  };

  const onStore = async (form: RequestEvent) => {
    handleOpenBackdrop();

    try {
      form.dates = dates;

      await onSubmit(form, file);
      handleOpenSnackbar();
      navigate({ pathname: "/admin/events" }, { state: null });
      reset();
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
  };

  return (
    <>
      <Stack direction={"column"} justifyContent={"flex-end"} spacing={2}>
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
          <Button variant="contained" onClick={handleSubmit(onStore)}>
            Guardar
          </Button>
        </Stack>
        <Card variant={"outlined"}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Stack spacing={3} direction={"column"}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          type={"text"}
                          label={"Titulo"}
                          variant={"outlined"}
                          value={value}
                          error={!!errors.title}
                          helperText={errors.title && errors.title.message}
                          onChange={({ target: { value } }) =>
                            onChangeInput(value, onChange, "title")
                          }
                        />
                      </>
                    )}
                    name={"title"}
                    defaultValue={""}
                    rules={{ ...isRequired }}
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          type={"text"}
                          label={"Descripción"}
                          variant={"outlined"}
                          multiline={true}
                          rows={10}
                          value={value}
                          error={!!errors.description}
                          helperText={
                            errors.description && errors.description.message
                          }
                          onChange={({ target: { value } }) =>
                            onChangeInput(value, onChange, "description")
                          }
                        />
                      </>
                    )}
                    name={"description"}
                    defaultValue={""}
                    rules={{ ...isRequired, ...maxLength(250) }}
                  />
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    spacing={2}
                  >
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <FormControl
                            variant={"filled"}
                            error={!!errors.calendar}
                          >
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateCalendar
                                disablePast
                                value={value}
                                shouldDisableDate={(day) =>
                                  shouldDisableDate(day)
                                }
                                onChange={(day: Moment) =>
                                  onChangeCalendar(day, onChange)
                                }
                              />
                            </LocalizationProvider>
                            {!!errors.calendar && (
                              <FormHelperText>
                                {errors.calendar.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </>
                      )}
                      name={"calendar"}
                      rules={{ ...isRequired }}
                    />
                    <List
                      dense
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 300,
                        "& ul": { padding: 0 },
                      }}
                    >
                      {!dates.length ? (
                        <>
                          <Div style={{ marginTop: "25%" }}>
                            No hay fechas seleccionadas
                          </Div>
                        </>
                      ) : (
                        dates.map((item: any, index: number) => {
                          const labelId = `checkbox-list-secondary-label-${index}`;
                          const date = moment(item.date);
                          const yesterday = moment().subtract(1, "day");
                          const disabled = yesterday.isSameOrAfter(date);

                          return (
                            <ListItem
                              key={index}
                              secondaryAction={
                                <>
                                  <IconButton
                                    disabled={disabled}
                                    onClick={() => removeDate(item)}
                                  >
                                    <DeleteTwoTone />
                                  </IconButton>
                                </>
                              }
                              disablePadding
                            >
                              <ListItemButton disabled={disabled}>
                                <ListItemText
                                  id={labelId}
                                  primary={`${moment(item.date).format(
                                    "D [de] MMMM [del] YYYY"
                                  )}`}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })
                      )}
                    </List>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={3} direction={"column"}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <FormControl
                          variant={"outlined"}
                          error={!!errors.categoryId}
                        >
                          <InputLabel>Categoría</InputLabel>
                          <Select
                            label={"Categoría"}
                            value={selectedCategory}
                            error={!!errors.categoryId}
                            onChange={({ target: { value } }) =>
                              onChangeCategory(value, onChange, "categoryId")
                            }
                          >
                            {categories &&
                              categories.map((category, index) => (
                                <MenuItem key={index} value={category.name}>
                                  {category.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {!!errors.categoryId && (
                            <FormHelperText>
                              {errors.categoryId.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </>
                    )}
                    name={"categoryId"}
                    defaultValue={""}
                    rules={{ ...isRequired }}
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          type={"text"}
                          label={"Buscar locación"}
                          variant={"standard"}
                          value={searcher}
                          onChange={({ target: { value } }) =>
                            onChangeSearcher(value)
                          }
                        />
                        <Autocomplete
                          disablePortal
                          options={options}
                          value={value}
                          open={!!searcher.length}
                          isOptionEqualToValue={(option, value) =>
                            option.label === value
                          }
                          onChange={(event, option, reason) =>
                            onChangeAutocomplete(option, reason, onChange)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={"Locatición"}
                              error={!!errors.location}
                              helperText={
                                errors.location && errors.location.message
                              }
                            />
                          )}
                        />
                      </>
                    )}
                    name={"location"}
                    defaultValue={""}
                    rules={{ ...isRequired }}
                  />
                  <Stack direction={"row"} spacing={2}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <LocalizationProvider
                            dateFormats={{ fullTime24h: "HH:mm" }}
                            dateAdapter={AdapterMoment}
                          >
                            <TimePicker
                              label={"Hora de Inicio"}
                              format={"HH:mm"}
                              value={startTimeDate}
                              slotProps={{
                                textField: {
                                  error: !!errors.startTime,
                                  helperText: errors.startTime
                                    ? errors.startTime.message
                                    : "",
                                },
                              }}
                              onChange={(startTime) =>
                                onChangeTime(startTime, onChange, "startTime")
                              }
                            />
                          </LocalizationProvider>
                        </>
                      )}
                      name={"startTime"}
                      defaultValue={startTimeDate?.format("HH:mm")}
                      rules={{ ...isRequired }}
                    />
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <LocalizationProvider
                            dateFormats={{ fullTime24h: "HH:mm" }}
                            dateAdapter={AdapterMoment}
                          >
                            <TimePicker
                              label={"Hora de Apertura"}
                              format={"HH:mm"}
                              value={openingTimeDate}
                              slotProps={{
                                textField: {
                                  error: !!errors.openingTime,
                                  helperText: errors.openingTime
                                    ? errors.openingTime.message
                                    : "",
                                },
                              }}
                              onChange={(openingTime) =>
                                onChangeTime(
                                  openingTime,
                                  onChange,
                                  "openingTime"
                                )
                              }
                            />
                          </LocalizationProvider>
                        </>
                      )}
                      name={"openingTime"}
                      defaultValue={openingTimeDate?.format("HH:mm")}
                      rules={{ ...isRequired }}
                    />
                  </Stack>
                  <Stack direction={"row"} spacing={2}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <FormControlLabel
                            control={
                              <Switch
                                value={value}
                                checked={value}
                                onChange={({ target: { checked } }) =>
                                  onChangeSwitch(
                                    checked,
                                    onChange,
                                    "minimumAge"
                                  )
                                }
                              />
                            }
                            label={"Edad minima"}
                          />
                        </>
                      )}
                      name={"minimumAge"}
                      defaultValue={false}
                      rules={{ ...isRequired }}
                    />
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <FormControlLabel
                            control={
                              <Switch
                                value={value}
                                checked={value}
                                onChange={({ target: { checked } }) =>
                                  onChangeSwitch(
                                    checked,
                                    onChange,
                                    "specialZone"
                                  )
                                }
                              />
                            }
                            label={"Accesibilidad"}
                          />
                        </>
                      )}
                      name={"specialZone"}
                      defaultValue={false}
                      rules={{ ...isRequired }}
                    />
                  </Stack>
                  <Box
                    component="img"
                    sx={{
                      height: 200,
                      width: "100%",
                    }}
                    src={!preview ? defaultImage : preview}
                  />
                  {preview ? (
                    <>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={cleanFile}
                      >
                        Eliminar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <FormControl
                            variant={"outlined"}
                            error={!!errors.images}
                          >
                            <Button
                              variant="contained"
                              component="label"
                              role={undefined}
                              tabIndex={-1}
                            >
                              Seleccionar imagen
                              <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={selectFile}
                              />
                            </Button>
                            {!!errors.images && (
                              <FormHelperText>
                                {errors.images.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                        name={"images"}
                        rules={{ ...isRequired }}
                      />
                    </>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
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
        message="Evento actualizado!"
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

export default NewEventForm;
