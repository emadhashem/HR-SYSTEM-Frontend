import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useDebounce } from "@uidotdev/usehooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  deleteEmployeeApi,
  FindEmployeeResponse,
  findEmployeesApi,
  updateEmployeeApi,
  UpdateEmployeeRequest,
} from "../services/employee/employee";
import { FaTrash } from "react-icons/fa";
import Pagination from "../components/my-ui/pagination";

import UpdateEmployeeModal from "../dashboard/update-employee/update-employee";
import RecordAttendance from "./record-attance/record-attance";

const EmployeesPage: React.FC = () => {
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<FindEmployeeResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDeleteEmployee, setLoadingDeleteEmployee] = useState(false);

  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearchTerm, page, perPage]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const result = await findEmployeesApi({
        search: debouncedSearchTerm,
        perPage,
        page,
      });
      setEmployees(result.data);
      setTotalPages(result.meta.totalPages);
      setLoadingEmployees(false);
    } catch (error) {
      setLoadingEmployees(false);
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees");
    }
  };

  const handleDeleteEmployee = async () => {
    if (employeeToDelete) {
      try {
        setLoadingDeleteEmployee(true);
        await deleteEmployeeApi(employeeToDelete);
        await fetchEmployees();
        toast.success("Employee deleted successfully");
        setLoadingDeleteEmployee(false);
      } catch (error: any) {
        toast.error("Error while deleting employee" + error.message);
        setLoadingDeleteEmployee(false);
      }
    } else {
      toast.error("Choose deleting employee");
    }
  };

  function handlePageChange(page: number): void {
    setPage(page);
  }

  async function updateEmployee(data: UpdateEmployeeRequest) {
    try {
      const employee = await updateEmployeeApi(data.id, data);
      setEmployees((prevEmployees) =>
        prevEmployees.map((prevEmployee) =>
          prevEmployee.id === employee.id ? employee : prevEmployee
        )
      );
      toast.success("Employee updated successfully");
    } catch (error: any) {
      toast.error("Error while updating employee" + error.message);
    }
  }

  return (
    <div className="p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employees</h1>
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search employees By name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Group</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEmployees && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!loadingEmployees &&
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>
                    <RecordAttendance
                      emEmail={employee.email}
                      emId={employee.id}
                      emName={employee.name}
                    />
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.groupType}</TableCell>
                  <TableCell className="text-center space-x-3 items-center justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setEmployeeToDelete(employee.id)}
                          disabled={loadingDeleteEmployee}
                        >
                          <FaTrash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this employee.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setEmployeeToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteEmployee}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <UpdateEmployeeModal
                      employee={employee}
                      onUpdate={updateEmployee}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default EmployeesPage;
