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
import DepartmentPage from "./department-page/department-page";
import SalaryPage from "./salary-page/salary-page";
import EmployeeProfilePage from "./employee-profile-page/employee-profile-page";

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
          <Route path="/employees/:id" element={<EmployeeProfilePage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/attendance" element={<AttendancePage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/departments" element={<DepartmentPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/salary" element={<SalaryPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
