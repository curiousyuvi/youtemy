import { Checkbox, Collapse, Layout, Menu, message } from "antd";
import "antd/dist/antd.css";
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { db } from "../../firebase";
import { UserContext } from "../../UserContext";
import "./VideoPlayer.css";

const { Sider, Content } = Layout;
const { Panel } = Collapse;

const RenderWithTracking = ({ playlistID }) => {
  const [playlistData, setPlaylistData] = useState({});
  const { uid } = useContext(UserContext);

  const [currentVideo, setCurrentVideo] = useState();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [videoDescription, setVideoDescription] = useState("");
  const [videoMargin, setVideoMargin] = useState(400);
  const [selectedMenuItem, setSelectedMenuItem] = useState("----");

  useEffect(() => {
    message.success("Tracking is on");
    const getPlaylist = async () => {
      const data = await db
        .collection("users")
        .doc(uid)
        .collection("currentlyEnrolled")
        .doc(playlistID)
        .get();
      setPlaylistData(data.data());
      setCurrentVideo(data.data().videos[0].videoId);
      setVideoDescription(data.data().videos[0].description);
    };
    getPlaylist();
  }, []);

  const findVideoAndSetWatched = async (videoId, what) => {
    let data = await db
      .collection("users")
      .doc(uid)
      .collection("currentlyEnrolled")
      .doc(playlistData.playlistInfo.playlistID)
      .get();

    data = data.data();

    data.videos.forEach((video) => {
      if (video.videoId === videoId) {
        if (!what) {
          video.watched = !video.watched;
        } else {
          video.watched = what;
        }
      }
    });

    db.collection("users")
      .doc(uid)
      .collection("currentlyEnrolled")
      .doc(playlistData.playlistInfo.playlistID)
      .set({
        playlistInfo: data.playlistInfo,
        videos: data.videos,
      });
    setPlaylistData(data);
  };

  const handleVideoEnded = () => {
    let idx;
    findVideoAndSetWatched(currentVideo, true);
    playlistData.videos.forEach((video) => {
      if (video.videoId === currentVideo) {
        idx = playlistData.videos.indexOf(video);
      }
    });
    idx === -1
      ? setCurrentVideo(currentVideo)
      : setCurrentVideo(playlistData.videos[++idx].videoId);
    setVideoDescription(playlistData.videos[idx].description);
  };

  const returnIframMarkup = () => {
    let videoURL = `https://www.youtube.com/embed/${currentVideo}`;
    return (
      <ReactPlayer
        controls={true}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        url={videoURL}
        playing={true}
        className="react-player"
        width="auto%"
        height={700}
        onEnded={handleVideoEnded}
      ></ReactPlayer>
    );
  };

  const RenderMenuItem = ({ videos }) => {
    if (videos === undefined) {
      return null;
    }
    const renderedMenuItem = videos.map((video) => {
      return (
        <Menu.Item
          key={video.videoId}
          className="menu-item"
          onClick={() => {
            setVideoDescription(video.description);
            setCurrentVideo(video.videoId);
          }}
        >
          <Checkbox
            className="menu-checkbox"
            checked={video.watched}
            onChange={() => {
              findVideoAndSetWatched(video.videoId, undefined);
            }}
          ></Checkbox>
          {video.title}
        </Menu.Item>
      );
    });
    return <Menu>{renderedMenuItem}</Menu>;
  };

  const handleMenuCollapse = (collapsed) => {
    setMenuCollapsed(collapsed);
    menuCollapsed ? setVideoMargin(400) : setVideoMargin(120);
  };

  return (
    <div>
      <Layout>
        <Sider
          collapsible
          onCollapse={handleMenuCollapse}
          collapsed={menuCollapsed}
          width={400}
          collapsedWidth={65}
          style={{
            overflow: "auto",
            height: "100%",
            position: "fixed",
            left: 0,
          }}
        >
          <Menu theme="light" mode="inline" selectedKeys={[selectedMenuItem]}>
            <Menu.Item key="9" style={{ paddingTop: 120, textAlign: "center" }}>
              <h2>Videos</h2>
            </Menu.Item>
            {playlistData ? (
              <RenderMenuItem videos={playlistData.videos} />
            ) : (
              " "
            )}
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: videoMargin }}>
          <Content style={{ margin: "50px 16px 0", overflow: "initial" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, textAlign: "center", minHeight: 820 }}
            >
              {returnIframMarkup()}
            </div>
            <Collapse bordered={false} defaultActiveKey={["1"]}>
              <Panel header="Description" key="1">
                <span className="description-span">{videoDescription}</span>{" "}
              </Panel>
            </Collapse>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default RenderWithTracking;
