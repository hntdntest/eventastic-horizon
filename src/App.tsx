
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";
import AttendeesDashboard from "./pages/attendee/Dashboard";
import OrganizerDashboard from "./pages/organizer/Dashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import EventAttendees from "./pages/organizer/EventAttendees";
import EventSettings from "./pages/organizer/EventSettings";
import Tickets from "./pages/organizer/Tickets";
import Sponsors from "./pages/organizer/Sponsors";
import Analytics from "./pages/organizer/Analytics";
import Settings from "./pages/organizer/Settings";
import Speakers from "./pages/organizer/Speakers";
import Notifications from "./pages/organizer/Notifications";
import Reports from "./pages/organizer/Reports";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminEvents from "./pages/admin/Events";
import AdminNotifications from "./pages/admin/Notifications";
import AdminMessages from "./pages/admin/Messages";
import AdminDatabase from "./pages/admin/Database";
import AdminSecurity from "./pages/admin/Security";
import AdminSettings from "./pages/admin/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Help from "./pages/Help";
import GetStarted from "./pages/GetStarted";
import ForOrganizers from "./pages/ForOrganizers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/attendee/dashboard" element={<AttendeesDashboard />} />
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/events/create" element={<CreateEvent />} />
            <Route path="/organizer/events/:eventId/edit" element={<EditEvent />} />
            <Route path="/organizer/events/:eventId/attendees" element={<EventAttendees />} />
            <Route path="/organizer/events/:eventId/settings" element={<EventSettings />} />
            
            {/* Organizer Management Routes */}
            <Route path="/organizer/tickets" element={<Tickets />} />
            <Route path="/organizer/sponsors" element={<Sponsors />} />
            <Route path="/organizer/analytics" element={<Analytics />} />
            <Route path="/organizer/settings" element={<Settings />} />
            <Route path="/organizer/speakers" element={<Speakers />} />
            <Route path="/organizer/notifications" element={<Notifications />} />
            <Route path="/organizer/reports" element={<Reports />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/database" element={<AdminDatabase />} />
            <Route path="/admin/security" element={<AdminSecurity />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/help" element={<Help />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/for-organizers" element={<ForOrganizers />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
