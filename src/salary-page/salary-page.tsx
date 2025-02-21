import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger } from "../components/ui/dialog";
import CreateSalary from "./create-salary/create-salary";
import {
  createSalaryApi,
  CreateSalaryRequestDto,
  deleteSalaryApi,
  getSalaryHistoryApi,
  GetSalaryHistoryResponseDto,
  updateSalaryApi,
  UpdateSalaryRequestDto,
} from "../services/salary/salary";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import UpdateSalary from "./update-salary/update-salary";

function SalaryPage() {
  const [salaries, setSalaries] = useState<GetSalaryHistoryResponseDto[]>([]);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const data = await getSalaryHistoryApi();
      setSalaries(data);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const handleCreateSalary = async (req: CreateSalaryRequestDto) => {
    try {
      const data = await createSalaryApi(req);
      setSalaries((prev) => [...prev, data]);
      toast.success("Salary created successfully");
    } catch (error) {
      toast.error("Error while creating salary" + error);
    }
  };

  const handleDeleteSalary = async (id: number) => {
    try {
      await deleteSalaryApi(id);
      setSalaries((prev) => prev.filter((salary) => salary.id !== id));
      toast.success("Salary deleted successfully");
    } catch (error: any) {
      toast.error("Error while deleting salary" + error.message);
    }
  };

  const handleUpdateSalary = async (
    id: number,
    req: UpdateSalaryRequestDto
  ) => {
    try {
      const data = await updateSalaryApi(id, req);
      setSalaries((prev) =>
        prev.map((salary) => (salary.id === id ? data : salary))
      );
      toast.success("Salary updated successfully");
    } catch (error) {
      toast.error("Error while updating salary" + error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Salary Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Salary</Button>
          </DialogTrigger>
          <CreateSalary handleCreateSalary={handleCreateSalary} />
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of employee salaries.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] text-center">Employee ID</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Pay Frequency</TableHead>
            <TableHead className="text-center">Effective Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary) => (
            <TableRow key={salary.id}>
              <TableCell className="font-medium text-center">
                {salary.employeeId}
              </TableCell>
              <TableCell className="text-center">{salary.amount}</TableCell>
              <TableCell className="text-center">
                {salary.payFrequency}
              </TableCell>
              <TableCell className="text-center">
                {new Date(salary.effectiveDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-3 justify-center ">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Edit />
                    </Button>
                  </DialogTrigger>
                  <UpdateSalary
                    salary={salary}
                    handleUpdateSalary={handleUpdateSalary}
                  />
                </Dialog>

                <Button onClick={() => handleDeleteSalary(salary.id)}>
                  <Trash color="red" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SalaryPage;
