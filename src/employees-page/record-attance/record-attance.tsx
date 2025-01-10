import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import {
  AttendanceStatus,
  createAttendanceApi,
  CreateAttendanceRequest,
} from "../../services/attendance/attendance";
import { toast } from "sonner";

type RecordAttendanceProps = {
  emId: number;
  emName: string;
  emEmail: string;
};

function RecordAttendance({ emEmail, emId, emName }: RecordAttendanceProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    control,
  } = useForm<CreateAttendanceRequest>({
    defaultValues: {
      date: "",
      status: "",
      employeeId: emId,
    },
  });

  const onSubmit: SubmitHandler<CreateAttendanceRequest> = async (data) => {
    try {
      const formattedDate = format(data.date, "yyyy-MM-dd");
      await createAttendanceApi({
        date: formattedDate,
        status: data.status,
        employeeId: emId,
      });
      toast.success("Attendance created successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error("Error while creating attendance" + error.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className="text-xl bg-gray-300 hover:bg-gray-700 hover:text-white"
          variant="secondary"
        >
          {emName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader content="">
          <DialogTitle className="text-xl">
            Record Attendance for{" "}
            <span className="font-extrabold">{emEmail}</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date Attendance:
          </label>
          <Controller
            control={control}
            name="date"
            rules={{ required: "Date is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <Calendar
                  mode="single"
                  selected={new Date(value)}
                  onSelect={onChange}
                  className={cn("border rounded-md", error && "border-red-500")}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 font-bold mb-2"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status", { required: "Status is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value={AttendanceStatus.Absent}>Absent</option>
              <option value={AttendanceStatus.Present}>Present</option>
              <option value={AttendanceStatus.Late}>Late</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
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
      </DialogContent>
    </Dialog>
  );
}

export default RecordAttendance;
