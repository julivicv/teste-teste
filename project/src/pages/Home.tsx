import React, {useEffect} from "react";
import Header from "../components/Header";
import {Card, CardActionArea, CardContent, CardMedia, Grid, Link, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Group, Note} from "@mui/icons-material";
import {useAuthUser} from "react-auth-kit";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser();

    useEffect(() => {
        if (auth()?.isAdmin !== "ADMIN") {
            navigate("../card");
        }
    }, []);

    return (
        <>
            <Header/>
            <Typography variant="h4" sx={{m: 2, textAlign: "center"}}>
                Welcome ADMIN
            </Typography>
            <Grid container justifyContent="center" spacing={5}>
                <Grid item xs={20} sm={6} md={4}>
                    <Card>
                        <CardActionArea
                            onClick={() => navigate("../class")}
                            sx={{textDecoration: "none", display: "flex"}}
                        >
                            <CardMedia
                                component={Note}
                                sx={{fontSize: 96, color: "primary.main", m: 2}}
                            />
                            <CardContent>
                                <Typography variant="h6">CRUD Class</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardActionArea
                            onClick={() => navigate("../user")}
                            sx={{textDecoration: "none", display: "flex"}}
                        >
                            <CardMedia
                                component={Group}
                                sx={{fontSize: 96, color: "primary.main", m: 2}}
                            />
                            <CardContent>
                                <Typography variant="h6">CRUD Users</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
