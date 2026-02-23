import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import EscapeRoomPage from "./pages/EscapeRoomPage";
import LoginSignupPage from "./pages/LoginSignupPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProjectSearchPage from "./pages/ProjectSearchPage";
import SubmitProjectPage from "./pages/SubmitProjectPage";
import ApplicationDashboardPage from "./pages/ApplicationDashboardPage";
import ProjectOwnerPanel from "./pages/ProjectOwnerPanel";
import HTFPage from "./pages/HTFPage";

export default function App() {
  const [route, setRoute] = useState(window.location.hash || "");
  
  useEffect(() => {
    document.title = "Projects Club  University of Toronto";
    const onHash = () => setRoute(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Route handling for different pages
  // if (route === '#/escape') {
  //   return <EscapeRoomPage />;
  // }

  if (route === '#/login') {
    return <LoginSignupPage />;
  }

  if (route === '#/profile') {
    return <ProfilePage />;
  }

  if (route.startsWith('#/profile/')) {
    const userId = parseInt(route.replace('#/profile/', ''), 10);
    if (!isNaN(userId)) {
      return <ProfilePage viewUserId={userId} />;
    }
  }

  if (route.startsWith('#/reset-password')) {
    return <ResetPasswordPage />;
  }

  if (route === '#/projects') {
    return <ProjectSearchPage />;
  }

  if (route === '#/submit-project') {
    return <SubmitProjectPage />;
  }

  if (route === '#/applications') {
    return <ApplicationDashboardPage />;
  }

  if (route === '#/manage-projects') {
    return <ProjectOwnerPanel />;
  }

  if (route === '#/htf') {
    return <HTFPage />;
  }

  return <HomePage />;
}
