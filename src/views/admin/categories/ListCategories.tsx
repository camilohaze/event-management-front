import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import {
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import EditTwoTone from "@mui/icons-material/EditTwoTone";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import { useForm, Controller } from "react-hook-form";

import { isRequired, alpha } from "src/utils/Validators";
import { RequestCategory, ResponseCategory } from "src/interfaces/category";
import {
  getAllCategories,
  storeCategory,
  updateCategory,
  removeCategory,
} from "src/actions/category";
import Transition from "src/components/Transition";
import { AxiosError } from "axios";

type ListCategoriesProps = {
  login: boolean;
  role: string;
  categories: ResponseCategory[];
  actions: any;
};

type ListCategoriesState = {
  categories: ResponseCategory[];
};

type ListCategoriesRow = {
  row: ResponseCategory;
  openUpdateDialog: Function;
  openDeleteDialog: Function;
};

const Row = (props: ListCategoriesRow) => {
  const { row, openUpdateDialog, openDeleteDialog } = props;

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell />
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
            <IconButton
              aria-label="Editar"
              onClick={() => openUpdateDialog(row)}
            >
              <EditTwoTone />
            </IconButton>
            <IconButton
              aria-label="Eliminar"
              onClick={() => openDeleteDialog(row)}
            >
              <DeleteTwoTone />
            </IconButton>
          </Stack>
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

const ListCategories = (props: ListCategoriesProps) => {
  const { login, role, categories, actions } = props;
  const navigate = useNavigate();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCreateSnackbar, setOpenCreateSnackbar] = useState(false);
  const [openUpdateSnackbar, setOpenUpdateSnackbar] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [order] = useState<Order>("asc");
  const [orderBy] = useState<keyof ResponseCategory>("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      id: 0,
      name: "",
    },
  });

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

      actions
        .getAllCategories()
        .then(() => (loading.current = !loading.current));
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
      stableSort<ResponseCategory>(
        categories,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, categories]
  );

  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const handleOpenUpdateSnackbar = () => {
    setOpenUpdateSnackbar(true);
  };

  const handleCloseUpdateSnackbar = () => {
    setOpenUpdateSnackbar(false);
  };

  const handleOpenDeleteSnackbar = () => {
    setOpenDeleteSnackbar(true);
  };

  const handleCloseDeleteSnackbar = () => {
    setOpenDeleteSnackbar(false);
  };

  const handleOpenCreateSnackbar = () => {
    setOpenCreateSnackbar(true);
  };

  const handleCloseCreateSnackbar = () => {
    setOpenCreateSnackbar(false);
  };

  const handleOpenCreateDialog = () => {
    reset();
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenUpdateDialog = (category: ResponseCategory) => {
    reset(category);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleOpenDeleteDialog = (category: ResponseCategory) => {
    reset(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onStore = async (form: RequestCategory) => {
    handleOpenBackdrop();

    try {
      await actions.storeCategory(form);
      handleCloseCreateDialog();
      handleOpenCreateSnackbar();
      await actions.getAllCategories();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response) {
          const { status } = response;

          console.log(response, status, "error");
        }
      }
    }

    handleCloseBackdrop();
  };

  const onUpdate = async (form: RequestCategory) => {
    handleOpenBackdrop();

    try {
      await actions.updateCategory(form);
      handleCloseUpdateDialog();
      handleOpenUpdateSnackbar();
      await actions.getAllCategories();
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response) {
          const { status } = response;

          console.log(response, status, "error");
        }
      }
    }

    handleCloseBackdrop();
  };

  const onDelete = async (form: RequestCategory) => {
    handleOpenBackdrop();

    try {
      await actions.removeCategory(form.id);
      handleCloseDeleteDialog();
      handleOpenDeleteSnackbar();
      await actions.getAllCategories();
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response) {
          const { status } = response;

          console.log(response, status, "error");
        }
      }
    }

    handleCloseBackdrop();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
            <Button
              variant={"contained"}
              onClick={() => handleOpenCreateDialog()}
            >
              Crear Categoría
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
                    <TableCell>ID</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((event: ResponseCategory) => (
                    <Row
                      key={event.id}
                      row={event}
                      openUpdateDialog={handleOpenUpdateDialog}
                      openDeleteDialog={handleOpenDeleteDialog}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={categories.length}
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
        open={openCreateSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseCreateSnackbar}
        message="Categoría creada con exito!"
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openUpdateSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseUpdateSnackbar}
        message="Categoría actualizada con exito!"
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openDeleteSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseDeleteSnackbar}
        message="Categoría eliminada con exito!"
      />
      <Dialog
        fullWidth={true}
        open={openCreateDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseCreateDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Crear categoría</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextField
                      type={"text"}
                      label={"Categoría"}
                      variant={"outlined"}
                      fullWidth={true}
                      margin="normal"
                      value={value}
                      error={!!errors.name}
                      helperText={errors.name && errors.name.message}
                      onChange={({ target: { value } }) => {
                        onChange(value);
                        trigger("name");
                      }}
                    />
                  </>
                )}
                name={"name"}
                defaultValue={""}
                rules={{ ...isRequired, ...alpha }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit(onStore)}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={openUpdateDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseUpdateDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextField
                      type={"text"}
                      label={"Categoría"}
                      variant={"outlined"}
                      fullWidth={true}
                      margin="normal"
                      value={value}
                      error={!!errors.name}
                      helperText={errors.name && errors.name.message}
                      onChange={({ target: { value } }) => {
                        onChange(value);
                        trigger("name");
                      }}
                    />
                  </>
                )}
                name={"name"}
                defaultValue={""}
                rules={{ ...isRequired, ...alpha }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit(onUpdate)}>
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            ¿Esta seguro que desea eliminar la categoria?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit(onDelete)}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: ListCategoriesState) => {
  return Object.assign({}, state.categories);
};
const actions = {
  getAllCategories,
  storeCategory,
  updateCategory,
  removeCategory,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListCategories);
