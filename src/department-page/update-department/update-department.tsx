import React, { useEffect, useState } from "react";
import {
  GetAllDepartmentsWithEmployeesResponseDto,
  UpdateDepartmentRequestDto,
} from "../../services/department/department";
import { DialogContent } from "../../components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import {
  FindEmployeeResponse,
  findEmployeesApi,
} from "../../services/employee/employee";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

type Props = {
  department: GetAllDepartmentsWithEmployeesResponseDto;
  handleUpdateDepartment: (
    id: number,
    data: UpdateDepartmentRequestDto
  ) => void;
};

type FormValues = {
  name: string;
};

function UpdateDepartment({ department, handleUpdateDepartment }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<FindEmployeeResponse[]>([]);
  const [page] = useState(1);
  const [perPage] = useState(100000);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [currentDepartmentsEmployee, setCurrentDepartmentsEmployee] = useState<
    FindEmployeeResponse[]
  >((department.employees as FindEmployeeResponse[]) ?? []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setEmployees([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      fetchEmployees();
    }
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
      setLoadingEmployees(false);
    } catch (error) {
      setLoadingEmployees(false);
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees");
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: department.name,
    },
  });

  const onSubmit = (data: FormValues) => {
    handleUpdateDepartment(department.id, {
      name: data.name,
      employees: currentDepartmentsEmployee.map((emp) => emp.id),
    });
  };

  const onEmployeeClick = (employee: FindEmployeeResponse) => {
    if (
      currentDepartmentsEmployee.find((emp) => emp.id === employee.id) ===
      undefined
    ) {
      setCurrentDepartmentsEmployee((prev) => [...prev, employee]);
    } else {
      setCurrentDepartmentsEmployee((prev) =>
        prev.filter((emp) => emp.id !== employee.id)
      );
    }
    setSearchQuery("");
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Department Name
          </label>
          <Input
            id="name"
            {...register("name", { required: "Department name is required" })}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="employeeSearch" className="text-sm font-medium">
            Search Employees to add them
          </label>
          <Input
            id="employeeSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loadingEmployees ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : (
            <div className="flex py-2 space-x-2 flex-wrap">
              {employees.map((emp) => (
                <Badge
                  key={emp.name}
                  className="flex flex-col max-w-fit rounded-2xl cursor-pointer"
                  onClick={() => onEmployeeClick(emp)}
                >
                  <p>{emp.name}</p>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">Employees</h3>
          <div className="flex py-2 space-x-2 flex-wrap">
            {currentDepartmentsEmployee.map((emp) => (
              <Badge
                key={emp.name}
                className="flex flex-col max-w-fit rounded-2xl"
              >
                <p>{emp.name}</p>
              </Badge>
            ))}
          </div>
        </div>

        <Button type="submit">Update Department</Button>
      </form>
    </DialogContent>
  );
}

export default UpdateDepartment;
