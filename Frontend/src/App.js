import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { LoginSignUp } from "./Components/LoginSignUp/LoginSignUp";
import { Navbar } from "./Components/Navbar/Navbar";
import { Questions } from "./Components/QuestionList/QuestionList";
import { LandingPage } from "./Components/LandingPage/LandingPage";
import CollaborationWindow from "./Components/Collaboration/CollaborationWindow";
import CommunicationWindow from "./Components/Collaboration/CommunicationWindow";
import AIChat from "./Components/GenerativeAI/AIChat";

import { isUserAdmin } from "./User/UserState";
import { isUserLoggedIn } from "./Authentication/AuthenticationState";
import useUserStatusHook from "./CustomHooks/userHook";

import "./App.css";

const ProtectedRoute = ({
  checkAdminStatus,
  redirectPath = "/login",
  children,
}) => {
  const userStatus = useUserStatusHook(isUserLoggedIn, isUserAdmin);

  if (userStatus.isLoading) {
    return <div>Loading...</div>;
  }

  if (!userStatus.isLoggedIn || (checkAdminStatus && !userStatus.isAdmin)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

const AIChatWrapper = () => {
  const location = useLocation();
  return location.pathname === "/collaboration" ? <AIChat /> : null;
};

const ChatWrapper = () => {
  const location = useLocation();
  return location.pathname === "/collaboration" ? (
    <CommunicationWindow />
  ) : null;
};

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <AIChatWrapper />
        <ChatWrapper />
        <Routes>
          <Route path="/login" element={<LoginSignUp />} />

          <Route element={<ProtectedRoute checkAdminStatus={false} />}>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/collaboration" element={<CollaborationWindow />} />
            <Route
              path="/unauthorized"
              element={<p>Peer, You Should'nt Be Here: 401!</p>}
            />
            <Route path="*" element={<p>Peer, Nothing To Prep Here: 404!</p>} />
          </Route>

          <Route
            path="/questions"
            element={
              <ProtectedRoute
                redirectPath="/unauthorized"
                checkAdminStatus={true}
              >
                <Questions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
