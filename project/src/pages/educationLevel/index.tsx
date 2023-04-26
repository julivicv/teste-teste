import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios, { AxiosError } from "axios";
import * as React from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

interface Classes {
  id: string;
  name: string;
}

interface EducationalLevelProps {
  name: string;
}

const initialFormData = {
  id: "",
  name: "",
};

export default function EducationLevel() {
  const authHeader = useAuthHeader();
  const [isAlter, setIsAlter] = React.useState(false);
  const [formData, setFormData] = React.useState<Classes>(initialFormData);
  const [rows, setRows] = React.useState<Classes[]>([]);
  const [open, setOpen] = React.useState(false);
  const [alter, setAlter] = React.useState(false);

  const auth = useAuthUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth()?.isAdmin !== "ADMIN") {
      navigate("../card");
    }
  }, []);

  function resetFormData() {
    setFormData(initialFormData);
    setAlter(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFormData();
  };

  async function handleSubmit() {
    axios
      .post(
        "http://localhost:3000/api/v1/educationLevel/create",
        { name: formData.name },
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
    setIsAlter(true);
    handleClose();
    resetFormData();
  }

  function formUpdate(data: Classes) {
    setFormData(data);
    setAlter(true);
    handleClickOpen();
  }

  async function handleAlter(id: string, data: EducationalLevelProps) {
    axios
      .put(`http://localhost:3000/api/v1/educationLevel/alter/${id}`, data, {
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
      .delete(`http://localhost:3000/api/v1/educationLevel/delete/${id}`, {
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

  React.useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/educationLevel", {
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
          <Typography color="text.primary">EducationLevel</Typography>
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
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Actions</TableCell>
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
          <DialogTitle>Criar Nível de Ensino</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={
                alter
                  ? () => handleAlter(formData.id, { name: formData.name })
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
