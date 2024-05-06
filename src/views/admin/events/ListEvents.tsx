import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import {
  Grid,
  Button,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop,
  CircularProgress,
  Snackbar,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditTwoTone from "@mui/icons-material/EditTwoTone";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import moment from "moment";
import "moment/locale/es";

import { ResponseEvent, ResponseUploadEvents } from "src/interfaces/event";
import { getByUserId, uploadEvents } from "src/actions/event";
import Transition from "src/components/Transition";
import VisuallyHiddenInput from "src/components/VisuallyHiddenInput";

type ListEventsProps = {
  login: boolean;
  role: string;
  userEvents: ResponseEvent[];
  upload?: ResponseUploadEvents;
  actions: any;
};

type ListEventsState = {
  userEvents: ResponseEvent[];
  upload: ResponseUploadEvents;
};

type ListEventsRow = {
  row: ResponseEvent;
};

const Row = (props: ListEventsRow) => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const startTime = (): string => {
    return moment(row.startTime, "hh:mm:ss").format("hh:mm a");
  };

  const openingTime = (): string => {
    return moment(row.openingTime, "hh:mm:ss").format("hh:mm a");
  };

  const onEdit = (row: ResponseEvent) => {
    navigate("/admin/events/edit", { state: row });
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{startTime()}</TableCell>
        <TableCell>{openingTime()}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={2}>
            <IconButton aria-label="Editar" onClick={() => onEdit(row)}>
              <EditTwoTone />
            </IconButton>
            <IconButton aria-label="Eliminar">
              <DeleteTwoTone />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Fechas
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.dates?.map((item) => {
                    const date = moment(item.date).format(
                      "D [de] MMMM [del] YYYY"
                    );

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ListEvents = (props: ListEventsProps) => {
  const { login, role, userEvents, upload, actions } = props;
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [order] = useState<Order>("asc");
  const [orderBy] = useState<keyof ResponseEvent>("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

      actions.getByUserId().then(() => (loading.current = !loading.current));
    }

    return () => {};
  }, [login, role, navigate, actions, loading]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      stableSort<ResponseEvent>(
        userEvents,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, userEvents]
  );

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

  const selectFile = (event: any) => {
    const {
      target: { files },
    } = event;

    setFile(files[0]);
    handleOpenDialog();
  };

  const uploadCSV = async () => {
    handleOpenBackdrop();

    try {
      const formData = new FormData();

      if (!!file) {
        formData.append("file", file);
      }

      await actions.uploadEvents(formData);
      await actions.getByUserId();

      if (upload && upload.error) {
        handleOpenNotification();
      } else {
        handleOpenSnackbar();
      }

      handleCloseDialog();
    } catch {
      console.log("Error!!!");
    }

    handleCloseBackdrop();
  };

  const cleanFile = () => {
    setFile(null);
    handleCloseDialog();
  };

  const handleOpenNotification = () => {
    setOpenNotification(true);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
            <Button
              variant="contained"
              component="label"
              role={undefined}
              tabIndex={-1}
            >
              Importar
              <VisuallyHiddenInput
                type="file"
                accept=".csv"
                onChange={selectFile}
              />
            </Button>
            <Button
              variant={"contained"}
              onClick={() => navigate("/admin/events/new", { state: null })}
            >
              Crear Evento
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer>
              <Table aria-label="collapsible table" size={"small"}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Evento</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Locación</TableCell>
                    <TableCell>Hora de Inicio</TableCell>
                    <TableCell>Hora de Apertura</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((event: any) => (
                    <Row key={event.id} row={event} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={userEvents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
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
        message="Eventos cargados con exito!"
      />
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            ¿Esta seguro que desea cargar el archivo {file?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanFile}>Cancelar</Button>
          <Button variant="contained" onClick={uploadCSV}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openNotification}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseNotification}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Notificación de carga</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText>
                Eventos que presentaron error al cargar:
              </ListItemText>
            </ListItem>
            {upload &&
              upload.imported.falided.map((event) => (
                <>
                  <ListItem>
                    <ListItemText>{event.title}</ListItemText>
                  </ListItem>
                </>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotification}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: ListEventsState) => {
  return Object.assign({}, state.userEvents, state.upload);
};
const actions = {
  getByUserId,
  uploadEvents,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListEvents);
