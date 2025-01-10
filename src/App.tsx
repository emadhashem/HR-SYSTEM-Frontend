import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./auth/login-page/login-page";
import Navbar from "./layout/nav-bar";
import { QueryClient, QueryClientProvider } from "react-query";
import RequireAuth from "./shared/require-auth";
import Dashboard from "./dashboard/dashboard";
import { Toaster } from "./components/ui/sonner";
import PublicAuth from "./shared/public-auth";
import EmployeesPage from "./employees-page/employees-page";
import AttendancePage from "./attendance-page/attendance-page";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Toaster />
      <Routes>
        <Route element={<PublicAuth />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/employees" element={<EmployeesPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/attendance" element={<AttendancePage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
