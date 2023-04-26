import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate, useParams } from "react-router-dom";
import IFLogo from "../../assets/IFLogo.svg";
import IFRSLogo from "../../assets/IFRSLogo.png";
import moment from "moment";
import "./card.css";
import Header from "../../components/Header";

const day = moment().format("dddd").toUpperCase();
interface UserData {
  name: string;
  group: string;
  dateOfBirth: string;
  link: string;
  course: string;
  photo: string;
  lunch: Array<string>;
}

const initialUserData = {
  id: "",
  name: "",
  group: "",
  dateOfBirth: "",
  link: "",
  course: "",
  photo: "",
  lunch: [],
};

const Card: React.FC = () => {
  const authHeader = useAuthHeader();
  const auth = useAuthUser();
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    if (auth()?.isAdmin !== "USER") {
      navigate("../");
    }
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/api/v1/user/card/${
          slug != undefined ? (slug as string) : (auth()?.id as string)
        }`,
        {
          headers: {
            Authorization: `${authHeader()}`,
          },
        }
      )
      .then((response) => {
        setUserData(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className={"loading"}>
          <p>Carregando...</p>
        </div>
      ) : (
        <>
          {slug == undefined ? <Header /> : ""}
          <div className="card-body">
            <div className="logo-container">
              <img src={IFRSLogo} alt={"logo do ifrs"} className={"logo"} />
            </div>
            <div className={"card-content"}>
              <h1>
                {userData.group} de {userData.course}
              </h1>
              <div className={"user-content"}>
                <img
                    alt={`avatar de ${userData.name}`}
                  src={"data:image/jpeg;base64, " + userData.photo}
                  className={"avatar"}
                />
                <span className={"student-name"}>{userData.name}</span>
                <span className={"birth-date"}>{userData.dateOfBirth}</span>
              </div>
              <div
                className={
                  userData.lunch.includes(day) ? "authorized" : "not-authorized"
                }
              >
                {userData.lunch.includes(day) ? (
                  <span>Almoço Liberado</span>
                ) : (
                  <span>Almoço Não Liberado</span>
                )}
              </div>
            </div>
            <div className={"vertical-line"}></div>
            <div className={"qrCode-container"}>
              {slug != undefined ? (
                ""
              ) : (
                <QRCodeSVG
                  onClick={() => console.log(userData.link)}
                  className={"qrCode"}
                  value={userData.link}
                  imageSettings={{
                    src: IFLogo,
                    x: undefined,
                    y: undefined,
                    height: 35,
                    width: 25,
                    excavate: true,
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Card;
