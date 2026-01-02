import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EventDetail from "./EventDetail";
import Login from "./Login";
import Signup from "./Signup";
import CreateEvent from "./CreateEvent";
import Events from "./Events";
import ScrollToTop from "../components/ScrollToTop";
import AdminReviewEvents from "./AdminReviewEvents";
import AdminReviewEventDetail from "./AdminReviewEventDetail";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import AdminEventsPage from "./admin/AdminEventsPage";
import VenueInsights from "./admin/VenueInsights";
import VenuePage from "./venue/VenuePage";
import UserDashboardLayout from "./dashboard/UserDashboardLayout";
import MyEvents from "./MyEvents";
import AccountInformation from "./dashboard/AccountInformation";
import PerformanceMetrics from "./dashboard/PerformanceMetrics";
import SupportResources from "./dashboard/SupportResources";
import Notifications from "./dashboard/Notifications";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/">
      <ScrollToTop />  {/* Пл?Y'^ este es el truco */}
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Navigate to="/" replace />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events/new" element={<CreateEvent />} />
        <Route path="/events/:id/edit" element={<CreateEvent />} />
        <Route path="/venue/:id" element={<VenuePage />} />
        <Route path="/events/mine" element={<Navigate to="/dashboard/events" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="events" element={<AdminEventsPage mode="all" />} />
          <Route path="events/pending" element={<AdminEventsPage mode="pending" />} />
          <Route path="events/live" element={<AdminEventsPage mode="live" />} />
          <Route path="events/disabled" element={<AdminEventsPage mode="disabled" />} />
          <Route path="events/deleted" element={<AdminEventsPage mode="deleted" />} />
        </Route>
        <Route path="/dashboard" element={<UserDashboardLayout />}>
          <Route index element={<Navigate to="events" replace />} />
          <Route path="events" element={<MyEvents embedded />} />
          <Route path="account" element={<AccountInformation />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="metrics" element={<PerformanceMetrics />} />
          <Route path="support" element={<SupportResources />} />
          <Route path="admin/review-events" element={<AdminReviewEvents embedded />} />
          <Route path="admin/review-events/:eventId" element={<AdminReviewEventDetail embedded />} />
          <Route path="admin/venues" element={<VenueInsights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
