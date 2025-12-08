import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../LandingPage";
import EventDetail from "./EventDetail";
import Login from "./Login";
import Signup from "./Signup";
import CreateEvent from "./CreateEvent";
import Events from "./Events";
import MyEvents from "./MyEvents";
import ScrollToTop from "../components/ScrollToTop";
import AdminReviewEvents from "./AdminReviewEvents";
import AdminReviewEventDetail from "./AdminReviewEventDetail";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/">
      <ScrollToTop />  {/* ĐY'^ este es el truco */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events/new" element={<CreateEvent />} />
        <Route path="/events/:id/edit" element={<CreateEvent />} />
        <Route path="/events/mine" element={<MyEvents />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin/review-events" element={<AdminReviewEvents />} />
        <Route path="/admin/review-events/:eventId" element={<AdminReviewEventDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
