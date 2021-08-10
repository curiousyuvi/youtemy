import {
  CaretRightOutlined,
  DeleteOutlined,
  ExpandAltOutlined,
} from "@ant-design/icons";
import { Card, Progress, Space } from "antd";
import "firebase/firestore";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import firebase, { db } from "../../firebase";
import { UserContext } from "../../UserContext";
import "./Dashboard.css";

const { Meta } = Card;

export default function Dashboard() {
  /* Setting the userId */
  const { uid, setUid } = useContext(UserContext);
  setUid(firebase.auth().currentUser.uid);

  db.collection("users").doc(firebase.auth().currentUser.uid).set(
    {
      name: "rose Kamal",
    },
    { merge: true }
  );

  return (
    <div className="wrapper">
      <Space direction="horizontal" align="center" width="80%" size={100}>
        <div>
          <h2 className="card-heading">Active Course</h2>
          <Card
            style={{ width: 300, margin: 0 }}
            cover={
              <img
                alt="example"
                src="https://i.ytimg.com/vi/pN6jk0uUrD8/hqdefault.jpg"
              />
            }
            actions={[
              <Link
                to={{
                  pathname: "/video-player",
                  playlistID: "PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
                }}
              >
                <CaretRightOutlined key="play" />
              </Link>,
              <Link to={{ pathname: "/settings" }}>
                <DeleteOutlined key="edit" />
              </Link>,
            ]}
          >
            <Meta
              title="Namaste JavaScript"
              description="Deep understanding of JavaScript"
            />
          </Card>
        </div>
        <div>
          <h2 className="card-heading">Progress</h2>
          <Card style={{ width: 300 }} actions={[<ExpandAltOutlined />]}>
            <div className="progress-circle-n">
              <Progress type="circle" percent={69} width={207}></Progress>
            </div>
            <Meta
              title="Current Course Progress"
              description="This is the description"
            />
          </Card>
        </div>
        <div>
          <h2 className="card-heading">Enroll New</h2>
          <Card
            style={{ width: 300, margin: 0 }}
            cover={
              <img
                alt="example"
                src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d109ce23061557.563311582423a.jpg"
              />
            }
            actions={[
              <Link to="/explore">
                <CaretRightOutlined key="play" />
              </Link>,
            ]}
          >
            <Meta
              title="Enroll New Courses"
              description="Explore and find what you need"
            />
          </Card>
        </div>
      </Space>
      <Footer />
    </div>
  );
}
