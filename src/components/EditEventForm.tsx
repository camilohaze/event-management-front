import { useEffect, useRef, useState } from "react";
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
  event: any;
  categories?: ResponseCategory[];
  onSubmit: any;
  autocompleteLocation: any;
};

const EditEventForm = (props: EditEventFormProps) => {
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
  const [calendar, setCalendar] = useState<Moment>(moment());
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
    },
  });
  const navigate = useNavigate();
  const defaultImage = "http://localhost:3000/uploads/400x200.png";
  let loading = useRef<boolean>(false);
  let { event, categories, autocompleteLocation, onSubmit } = props;

  useEffect(() => {
    if (!loading.current) {
      loading.current = !loading.current;

      if (event) {
        setPreview(event.image);

        Object.keys(event).forEach((property: string) => {
          switch (property) {
            case "title":
            case "description":
            case "location":
            case "latitude":
            case "longitude":
              setValue(property, event[property]);
              break;

            case "categoryId":
              setValue(property, event[property]);
              break;

            case "category":
              setSelectedCategory(event[property]);
              break;

            case "startTime":
              setStartTimeDate(moment(event[property], "HH:mm"));
              setValue(property, event[property]);
              break;

            case "openingTime":
              setOpeningTimeDate(moment(event[property], "HH:mm"));
              setValue(property, event[property]);
              break;

            case "minimumAge":
            case "specialZone":
              setValue(property, Boolean(event[property]));
              break;
          }
        });
      }

      setTimeout(() => {
        loading.current = !loading.current;
      }, 0);
    }

    return () => {};
  }, [reset, event, setValue, calendar]);

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
    if (!!event.dates) {
      const date = day.format("YYYY-MM-DD");
      const exists = event.dates.find((item: any) => item.date === date);

      return !!exists;
    }

    return false;
  };

  const onChangeCalendar = (day: Moment) => {
    if (!!event.dates) {
      const newDates = [...event.dates];
      const newDate = {
        id: Date.now(),
        date: day.format("YYYY-MM-DD"),
      };

      newDates.push(newDate);

      event.dates = [...newDates];

      setCalendar(day.subtract(1, "second"));
    }
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
    if (!!event.dates) {
      const dateIndex = event.dates.findIndex((p: any) => p.date === item.date);
      const newDates = [...event.dates];

      newDates.splice(dateIndex, 1);

      event.dates = [...newDates];

      setDates(newDates);
    }
  };

  const onUpdate = async (form: RequestEvent) => {
    handleOpenBackdrop();

    try {
      await onSubmit({ ...event, ...form }, file);
      reset();
      handleOpenSnackbar();
      navigate({ pathname: "/admin/events" }, { state: null });
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
          <Button variant="contained" onClick={handleSubmit(onUpdate)}>
            Actualizar
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
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateCalendar
                        disablePast
                        value={calendar}
                        shouldDisableDate={(day) => shouldDisableDate(day)}
                        onChange={(day: Moment) => onChangeCalendar(day)}
                      />
                    </LocalizationProvider>
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
                      {!event.dates.length ? (
                        <>
                          <Div style={{ marginTop: "25%" }}>
                            No hay fechas seleccionadas
                          </Div>
                        </>
                      ) : (
                        event.dates?.map((item: any, index: number) => {
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

export default EditEventForm;
