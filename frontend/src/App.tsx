import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import EscapeRoomPage from "./pages/EscapeRoomPage";
import LoginSignupPage from "./pages/LoginSignupPage";

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

  return <HomePage />;
}
