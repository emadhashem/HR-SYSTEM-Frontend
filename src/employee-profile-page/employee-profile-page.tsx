import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  getEmployeeProfileApi,
  GetEmployeeProfileResponseDto,
} from "../services/employee/employee";
import { toast } from "sonner";

const AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=profile";

function EmployeeProfilePage() {
  const { id } = useParams();

  const [employeeProfile, setEmployeeProfile] = useState<
    GetEmployeeProfileResponseDto | undefined
  >(undefined);

  useEffect(() => {
    if (id) {
      fetchProfile(+id);
    }
  }, [id]);

  const fetchProfile = async (id: number) => {
    try {
      const profile = await getEmployeeProfileApi(+id);
      setEmployeeProfile(profile);
    } catch (error: any) {
      toast.error("Error while fetching employee profile" + error.message);
    }
  };

  if (!employeeProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={AVATAR} alt={employeeProfile.name} />
              <AvatarFallback>{employeeProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{employeeProfile.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{employeeProfile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p>{employeeProfile.departmentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p>{employeeProfile.employeeStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary History Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Salary History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Pay Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeProfile.salaryHistory.map((salary: any) => (
                  <TableRow key={salary.effectiveDate}>
                    <TableCell className="text-center">
                      {
                        new Date(salary.effectiveDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      ${salary.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {salary.payFrequency}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeProfilePage;
