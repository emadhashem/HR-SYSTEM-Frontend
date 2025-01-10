import axios from "axios";
import { API_URL } from "../../shared/constants";
import { resolveErrorMessage } from "../error-resolver";

class Attendance {
  async createAttendanceApi(request: CreateAttendanceRequest) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.post<CreateAttendanceResponse>(
        `${API_URL}/attendance/create`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  }

  async updateAttendanceApi(id: number, status: AttendanceStatus) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.patch<CreateAttendanceResponse>(
        `${API_URL}/attendance/update/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  }

  async findAttendanceApi(filters: FindAttendanceFilters) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.get<FindAttendancePageResponse>(
        `${API_URL}/attendance/get-by-date`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  }
}

export enum AttendanceStatus {
  Present = "Present",
  Absent = "Absent",
  Late = "Late",
}

export type CreateAttendanceRequest = {
  date: string;
  status: string;
  employeeId: number;
};

export type CreateAttendanceResponse = {
  id: number;
  date: Date;
  status: string;
  employeeId: number;
  createdAt: Date;
  updatedAt: Date;
  employee: {
    id: number;
    name: string;
    email: string;
  };
};

export type FindAttendanceFilters = {
  page?: number;
  perPage?: number;
  date?: string;
};

export type FindAttendancePageResponse = {
  data: CreateAttendanceResponse[];
  meta: {
    totalPages: number;
  };
};

export const { createAttendanceApi, findAttendanceApi, updateAttendanceApi } =
  new Attendance();
