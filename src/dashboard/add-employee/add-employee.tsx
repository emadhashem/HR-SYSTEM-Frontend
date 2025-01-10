import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CreateEmployeeRequest } from "../../services/employee/employee";
import { GroupType } from "../../shared/employee-types";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (employee: CreateEmployeeRequest) => Promise<void>;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  onCreate,
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    watch,
  } = useForm<CreateEmployeeRequest>({
    defaultValues: {
      groupType: GroupType.HR,
    },
  });

  const onSubmit: SubmitHandler<CreateEmployeeRequest> = (data) => {
    try {
      onCreate(data);
    } catch (error: any) {
      console.error("Error creating employee:", error.message);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent onInteractOutside={onClose} className="sm:max-w-md">
        <DialogHeader content="">
          <DialogTitle>Create Employee</DialogTitle>
        </DialogHeader>

        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Create New Employee</h2>
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
            {watch("groupType") === GroupType.HR && (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters",
                    },
                  })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
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
                onClick={onClose}
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
                Create
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeModal;
