import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import Card from "./pages/Card/Card";
import Classes from "./pages/Class";
import ClassRoom from "./pages/classroom";
import Course from "./pages/course";
import EducationLevel from "./pages/educationLevel";
import Home from "./pages/Home";
import Login from "./pages/Login";
import User from "./pages/user";

function Router() {
  return (
    <Routes>
      <Route path={"/login"} element={<Login />} />
      <Route
        path={"/user"}
        element={
          <RequireAuth loginPath={"/login"}>
            <User />
          </RequireAuth>
        }
      />

      <Route
        path={"/"}
        element={
          <RequireAuth loginPath={"/login"}>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path={"/class"}
        element={
          <RequireAuth loginPath={"/login"}>
            <Classes />
          </RequireAuth>
        }
      />
      <Route
        path={"/class/educationLevel"}
        element={
          <RequireAuth loginPath={"/login"}>
            <EducationLevel />
          </RequireAuth>
        }
      />
      <Route
        path={"/class/course"}
        element={
          <RequireAuth loginPath={"/login"}>
            <Course />
          </RequireAuth>
        }
      />
      <Route
        path={"/class/classroom"}
        element={
          <RequireAuth loginPath={"/login"}>
            <ClassRoom />
          </RequireAuth>
        }
      />
      <Route
        path={"/card"}
        element={
          <RequireAuth loginPath={"/login"}>
            <Card />
          </RequireAuth>
        }
      />
      <Route path={"/card/public/:slug"} element={<Card />} />
    </Routes>
  );
}

export default Router;
