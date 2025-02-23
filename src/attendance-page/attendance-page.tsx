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
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import {
  AttendanceStatus,
  CreateAttendanceResponse,
  findAttendanceApi,
  updateAttendanceApi,
} from "../services/attendance/attendance";
import { toast } from "sonner";
import Pagination from "../components/my-ui/pagination";

const AttendancePage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    CreateAttendanceResponse[]
  >([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(5);
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const dateString = format(date, "yyyy-MM-dd");
        const result = await findAttendanceApi({
          date: dateString,
          page,
          perPage,
        });
        setAttendanceRecords(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (error: any) {
        toast.error("Error fetching attendance " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [date, page, perPage]);

  const handleAttendanceChange = async (
    attendanceId: number,
    status: AttendanceStatus
  ) => {
    try {
      await updateAttendanceApi(attendanceId, status);
      setAttendanceRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === attendanceId ? { ...record, status } : record
        )
      );
      toast.success("Attendance updated successfully");
    } catch (error: any) {
      toast.error("Error updating attendance: " + error);
    }
  };

  return (
    <div className="p-6">
      <div className="container mx-auto flex flex-col md:flex-row gap-3">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-8">Attendance</h1>
          <div className="flex items-center space-x-2 mb-4">
            <p>Select Date:</p>
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>
        </div>
        {loading && <p>Loading...</p>}
        <div className="flex flex-col items-center w-full">
          {!loading && date && (
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-xl font-semibold">
                      {record.employee.name}
                    </TableCell>
                    <TableCell>
                      <select
                        value={record.status}
                        onChange={(e) =>
                          handleAttendanceChange(
                            record.id,
                            e.target.value as AttendanceStatus
                          )
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter >
                <Pagination
                  currentPage={page}
                  onPageChange={(num) => setPage(num)}
                  totalPages={totalPages}
                />
              </TableFooter>
            </Table>
          )}
          {!loading && date && attendanceRecords.length === 0 && (
            <p className="text-center">No attendance records for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
