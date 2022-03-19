import Login from "./components/Login/Login.js";
import Registration from "./components/Registration/Registration.js";
import Home from "./components/Home/Home.js";
import User from "./components/User_page/User.js";
import UserList from "./components/UserList/UserList.js";
import ToolBar from "./components/ToolBar/ToolBar.js";
import TweetPage from "./components/TweetPage/TweetPage.js";

export const notAuthRoutes = [
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
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
    path: "profile/:id/home",
    element: <Home />,
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
        <TweetPage />
      </>
    ),
  },
];
