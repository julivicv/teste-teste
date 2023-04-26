import { Card, CardContent, Link, Typography } from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useEffect } from "react";

export default function Class() {
  const auth = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth()?.isAdmin !== "ADMIN") {
      navigate("../card");
    }
  }, []);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Header />

      <Card sx={{ width: "100%", margin: "8px", borderRadius: "0px" }}>
        <CardContent>
          <Link underline="hover" color="inherit" href="/class/educationLevel">
            <Typography variant="h6" component="div">
              Education Level
            </Typography>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ width: "100%", margin: "8px", borderRadius: "0px" }}>
        <CardContent>
          <Link underline="hover" color="inherit" href="/class/course">
            <Typography variant="h6" component="div">
              Course
            </Typography>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ width: "100%", margin: "8px", borderRadius: "0px" }}>
        <CardContent>
          <Link underline="hover" color="inherit" href="/class/classRoom">
            <Typography variant="h6" component="div">
              Class Room
            </Typography>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
