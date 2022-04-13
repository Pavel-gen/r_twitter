import Login from "./components/Login/Login.js";
import Registration from "./components/Registration/Registration.js";
import Home from "./components/Home/Home.js";
import User from "./components/User_page/User.js";
import UserList from "./components/UserList/UserList.js";
import ToolBar from "./components/ToolBar/ToolBar.js";
import ThreadPage from "./components/ThreadPage/ThreadPage.js";
import PersonalTweetPage from "./components/PersonalTweetPage/PersonalTweetPage.js";

export const notAuthRoutes = [
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <>
        <ToolBar />
        <Home type="global_line" />
      </>
    ),
  },
];

export const AuthRoutes = [
  {
    path: "/profile/:id",
    element: <User type="tweets" />,
  },
  {
    path: "profile/:id/likes",
    element: <User type="likes" />,
  },
  {
    path: "profile/:id/replies",
    element: <User type="replies" />,
  },
  {
    path: "profile/:id/media",
    element: <User type="media" />,
  },
  {
    path: "profile/:id/home",
    element: <Home type="home" />,
  },
  {
    path: "profile/:id/followers",
    element: (
      <>
        <ToolBar />
        <UserList type="followers" />
      </>
    ),
  },
  ,
  {
    path: "profile/:id/following",
    element: (
      <>
        <ToolBar />
        <UserList type="following" />
      </>
    ),
  },
  ,
  {
    path: "profile/:id/knownfollowers",
    element: (
      <>
        <ToolBar />
        <UserList type="knownfollowers" />
      </>
    ),
  },
  {
    path: "tweets/thread/:id",
    element: (
      <>
        <ToolBar />
        <ThreadPage />
      </>
    ),
  },
  {
    path: "tweets/:id",
    element: (
      <>
        <ToolBar />
        <PersonalTweetPage />
      </>
    ),
  },
];
