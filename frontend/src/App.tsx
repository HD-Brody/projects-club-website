import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
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

  let page = <HomePage />;

  if (route === '#/login') {
    page = <LoginSignupPage />;
  } else if (route === '#/profile') {
    page = <ProfilePage />;
  } else if (route.startsWith('#/profile/')) {
    const userId = parseInt(route.replace('#/profile/', ''), 10);
    if (!isNaN(userId)) {
      page = <ProfilePage viewUserId={userId} />;
    }
  } else if (route.startsWith('#/reset-password')) {
    page = <ResetPasswordPage />;
  } else if (route === '#/projects') {
    page = <ProjectSearchPage />;
  } else if (route === '#/submit-project') {
    page = <SubmitProjectPage />;
  } else if (route === '#/applications') {
    page = <ApplicationDashboardPage />;
  } else if (route === '#/manage-projects') {
    page = <ProjectOwnerPanel />;
  } else if (route === '#/htf') {
    page = <HTFPage />;
  }

  return (
    <>
      {page}
      <Analytics />
    </>
  );
}
