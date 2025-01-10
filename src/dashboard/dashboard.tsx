import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateEmployeeModal from "./add-employee/add-employee";
import { toast } from "sonner";
import {
  createEmployeeApi,
  CreateEmployeeRequest,
} from "../services/employee/employee";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [openAddEmModal, setOpenAddEmModal] = useState(false);

  const handleOnAddEmAction = () => {
    setOpenAddEmModal(true);
  };
  const handleOnCloseAddEmModal = () => {
    setOpenAddEmModal(false);
  };
  const handleOnCreateEmployee = async (data: CreateEmployeeRequest) => {
    try {
      if (!data.password) data.password = undefined;
      await createEmployeeApi(data);
      handleOnCloseAddEmModal();
      toast.success("Employee created successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <CreateEmployeeModal
        isOpen={openAddEmModal}
        onClose={handleOnCloseAddEmModal}
        onCreate={handleOnCreateEmployee}
      />
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Employee Summary
            </h2>
            <div className="text-gray-600">
              <p>
                Total Employees: <strong>25</strong>
              </p>{" "}
              <p>
                HR Employees: <strong>22</strong>
              </p>
              <p>
                New Hires (This Month): <strong>3</strong>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Recent Attendance
            </h2>
            <div className="text-gray-600">
              <ul>
                <li>John Doe - Present</li>
                <li>Jane Smith - Absent</li>
                <li>Peter Jones - Late</li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Quick Actions
            </h2>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleOnAddEmAction}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Add Employee
              </button>
              <button
                onClick={() => navigate("/attendance")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Record Attendance
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Upcoming Holidays & Events
            </h2>
            <div className="text-gray-600">
              <ul>
                <li>
                  <strong>New Year's Day</strong> - January 1, 2025
                </li>
                <li>
                  <strong>Company Retreat</strong> - March 15-17, 2024
                </li>
                <li>
                  <strong>Independence Day</strong> - July 4, 2024
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
