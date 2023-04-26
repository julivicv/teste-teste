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
  Checkbox,
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

interface Courses {
  id: string;
  name: string;
}

interface ClassRoomProps {
  id: string;
  name: string;
  course: string;
  courseId: string;
  lunch: Array<string>;
}

const initialFormData = {
  id: "",
  name: "",
  Couser: {
    name: "",
  },
  courseId: "",
  course: "",
  lunch: [],
};


enum WEEKDAYS {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",

}

const getFormattedWeekday = (w: string, plural = false) => {
  switch (w){
    case WEEKDAYS.MONDAY: return `Segunda${plural?'s':''}-feira${plural?'s':''}`
    case WEEKDAYS.TUESDAY: return `Terça${plural?'s':''}-feira${plural?'s':''}`
    case WEEKDAYS.WEDNESDAY: return `Quarta${plural?'s':''}-feira${plural?'s':''}`
    case WEEKDAYS.THURSDAY: return `Quinta${plural?'s':''}-feira${plural?'s':''}`
    case WEEKDAYS.FRIDAY: return `Sexta${plural?'s':''}-feira${plural?'s':''}`
    default: return "ERROR"

  }
}

export default function ClassRoom() {
  const auth = useAuthUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth()?.isAdmin !== "ADMIN") {
      navigate("../card");
    }
  }, []);

  const authHeader = useAuthHeader();
  const [rows, setRows] = React.useState<ClassRoomProps[]>([]);
  const [courses, setCourses] = React.useState<Courses[]>([]);
  const [formData, setFormData] =
    React.useState<ClassRoomProps>(initialFormData);
  const [isAlter, setIsAlter] = React.useState(false);
  const [alter, setAlter] = React.useState(false);

  function resetFormData() {
    setFormData(initialFormData);
    setAlter(false);
  }

  async function handleSubmit() {
    axios
      .post(
        "http://localhost:3000/api/v1/classroom/create",
        {
          name: formData.name,
          couserId: formData.courseId,
          lunch: formData.lunch,
        },
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

  function formUpdate(data: ClassRoomProps) {
    setFormData(data);
    setAlter(true);
    handleClickOpen();
  }

  async function handleAlter(
    id: string,
    data: {
      name: string;
      couserId: string;
      lunch: [string];
    }
  ) {
    axios
      .put(`http://localhost:3000/api/v1/classRoom/alter/${id}`, data, {
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
    console.log("delete");

    axios
      .delete(`http://localhost:3000/api/v1/classroom/delete/${id}`, {
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
    authHeader;
    axios
      .get("http://localhost:3000/api/v1/course", {
        headers: {
          Authorization: `${authHeader()}`,
        },
      })
      .then((response) => {
        setCourses(response.data.message);
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:3000/api/v1/classroom", {
        headers: {
          Authorization: `${authHeader()}`,
        },
      })
      .then((response) => {
        setRows(response.data.message);
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsAlter(false);
  }, [isAlter]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFormData();
  };

  const weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

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
          <Typography color="text.primary">ClassRoom</Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          sx={{ "&": { marginY: 2 } }}
          onClick={handleClickOpen}
        >
          Criar
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Nome</TableCell>
                <TableCell align="left">Curso</TableCell>
                <TableCell align="left">Dias de Almoço</TableCell>
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
                    {row.course}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.lunch.map((e) => (
                      <span> {getFormattedWeekday(e)} </span>
                    ))}
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
          <DialogTitle>Criar Sala</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
              fullWidth
              variant="standard"
            />
            <FormControl fullWidth sx={{ "&": { display: "flex", gap: 2 } }}>
              <InputLabel id="demo-simple-select-label">Course</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.courseId}
                label="Course"
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
              >
                {courses.map((course) => (
                  <MenuItem value={course.id}>{course.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          {weekDays.map((day: string) => (
            <div>
              <Checkbox
                checked={formData.lunch.includes(day)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setFormData((prev: ClassRoomProps) =>
                    checked
                      ? { ...prev, lunch: [...prev.lunch, day] }
                      : {
                          ...prev,
                          lunch: prev.lunch.filter((p: string) => p !== day),
                        }
                  );
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
              {day}
            </div>
          ))}

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={
                alter
                  ? () =>
                      handleAlter(formData.id, {
                        name: formData.name,
                        couserId: formData.courseId,
                        lunch: formData.lunch as [string],
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
