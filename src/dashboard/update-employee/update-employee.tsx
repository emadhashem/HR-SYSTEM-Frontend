import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  FindEmployeeResponse,
  UpdateEmployeeRequest,
} from "../../services/employee/employee";
import { GroupType } from "../../shared/employee-types";
import { Button } from "../../components/ui/button";
import { FaPenToSquare } from "react-icons/fa6";

interface UpdateEmployeeModalProps {
  onUpdate: (employee: UpdateEmployeeRequest) => Promise<void>;
  employee: FindEmployeeResponse;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({
  onUpdate,
  employee,
}) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<UpdateEmployeeRequest>({
    values: {
      name: employee.name,
      email: employee.email,
      groupType: employee.groupType,
      id: employee.id,
    },
  });

  const onSubmit: SubmitHandler<UpdateEmployeeRequest> = (data) => {
    onUpdate(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <FaPenToSquare />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader content="">
          <DialogTitle>Update Employee</DialogTitle>
        </DialogHeader>
        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Update Employee</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="group"
                className="block text-gray-700 font-bold mb-2"
              >
                Group
              </label>
              <select
                id="group"
                {...register("groupType", { required: "Group is required" })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value={GroupType.HR}>HR</option>
                <option value={GroupType.Normal_Employee}>
                  Normal Employee
                </option>
              </select>
              {errors.groupType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.groupType.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployeeModal;
