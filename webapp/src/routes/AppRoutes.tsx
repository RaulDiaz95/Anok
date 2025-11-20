import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../LandingPage";
import EventDetail from "./EventDetail";
import Login from "./Login";
import Signup from "./Signup";
import ScrollToTop from "../components/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/">
      <ScrollToTop />  {/* 👈 este es el truco */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
