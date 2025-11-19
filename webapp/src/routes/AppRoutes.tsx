import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../LandingPage";
import EventDetail from "./EventDetail";
import ScrollToTop from "../components/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/Anoktest-web">
      <ScrollToTop />  {/* 👈 este es el truco */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/event/:id" element={<EventDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
