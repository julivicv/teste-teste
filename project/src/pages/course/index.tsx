import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import axios, { AxiosError } from "axios";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

interface Classes {
  id: string;
  name: string;
}

interface FormValues {
  id: string;
  name: string;
  educationLevelId: string;
  educationLevel: {
    name: string;
  };
}

const initialFormData = {
  id: "",
  name: "",
  educationLevelId: "",
  educationLevel: {
    name: "",
  },
};

export default function Course() {
  const authHeader = useAuthHeader();
  const [isAlter, setIsAlter] = React.useState(false);
  const [formData, setFormData] = React.useState<FormValues>(initialFormData);
  const [rows, setRows] = React.useState<FormValues[]>([]);
  const [open, setOpen] = React.useState(false);
  const [educationalLevels, setEducationalLevels] = React.useState<Classes[]>(
    []
  );
  const [alter, setAlter] = React.useState(false);

  console.log(alter);

  function resetFormData() {
    setFormData(initialFormData);
    setAlter(true);
  }

  const auth = useAuthUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth()?.isAdmin !== "ADMIN") {
      navigate("../card");
    }
  }, []);

  async function handleSubmit() {
    axios
      .post(
        "http://localhost:3000/api/v1/course/create",
        { name: formData.name, educationLevelId: formData.educationLevelId },
        {
          headers: {
            Authorization: `${authHeader()}`,
          },
        }
      )
      .then(
        (response) => {
          console.log(response);
        },
        (error: AxiosError) => {
          console.log(error);
        }
      );
    handleClose();
    resetFormData();
    setIsAlter(true);
  }

  React.useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/educationLevel", {
        headers: {
          Authorization: `${authHeader()}`,
        },
      })
      .then((response) => {
        setEducationalLevels(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsAlter(false);

    axios
      .get("http://localhost:3000/api/v1/course", {
        headers: {
          Authorization: `${authHeader()}`,
        },
      })
      .then((response) => {
        setRows(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsAlter(false);
  }, [isAlter]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlter(true);
    resetFormData();
  };

  function formUpdate(data: FormValues) {
    setFormData(data);
    setAlter(true);
    handleClickOpen();
  }

  async function handleAlter(
    id: string,
    data: {
      name: string;
      educationLevelId: string;
    }
  ) {
    axios
      .put(`http://localhost:3000/api/v1/course/alter/${id}`, data, {
        headers: {
          Authorization: `${authHeader()}`,
        },
      })
      .then(
        (response) => {
          console.log(response);
        },
        (error: AxiosError) => {
          console.log(error);
        }
      );
    setIsAlter(true);
    handleClose();
    resetFormData();
  }

  async function handleDelete(id: string) {
    axios
      .delete(`http://localhost:3000/api/v1/course/delete/${id}`, {
        headers: {
          Authorization: `${authHeader()}`,
        },
      })
      .then(
        (response) => {
          console.log(response);
        },
        (error: AxiosError) => {
          console.log(error);
        }
      );
    setIsAlter(true);
    resetFormData();
  }

  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/class">
            Class
          </Link>
          <Typography color="text.primary">Course</Typography>
        </Breadcrumbs>
        <br />
        <Button variant="contained" onClick={handleClickOpen}>
          Criar
        </Button>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Nome</TableCell>
                <TableCell align="left">Nível de Ensino</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.educationLevel.name}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ "&": { display: "flex", gap: 2 } }}
                  >
                    <Button
                      onClick={() => formUpdate(row)}
                      variant="outlined"
                      color="success"
                    >
                      Alter
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      variant="outlined"
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Criar Curso</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nome"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
              fullWidth
              variant="standard"
            />
            <br />

            <br />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Nível de Ensino
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.educationLevelId}
                label="Nível Educacional"
                onChange={(e) =>
                  setFormData({ ...formData, educationLevelId: e.target.value })
                }
              >
                {educationalLevels.map((el) => (
                  <MenuItem value={el.id}>{el.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={
                alter
                  ? () =>
                      handleAlter(formData.id, {
                        name: formData.name,
                        educationLevelId: formData.educationLevelId,
                      })
                  : () => handleSubmit()
              }
            >
              {alter ? "Alterar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
