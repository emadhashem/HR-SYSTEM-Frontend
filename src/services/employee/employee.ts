import axios from "axios";
import { API_URL } from "../../shared/constants";
import { GroupType } from "../../shared/employee-types";
import { resolveErrorMessage } from "../error-resolver";
import { PayFrequency } from "../salary/salary";

class EmployeeApi {
  async createEmployeeApi(createEmployeeRequest: CreateEmployeeRequest) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.post<CreateEmployeeResponse>(
        `${API_URL}/employee/create`,
        createEmployeeRequest,
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

  async deleteEmployeeApi(id: number) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.delete(`${API_URL}/employee/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  }

  async updateEmployeeApi(
    id: number,
    updateEmployeeRequest: UpdateEmployeeRequest
  ) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.patch<UpdateEmployeeResponse>(
        `${API_URL}/employee/update/${id}`,
        updateEmployeeRequest,
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

  async findEmployeesApi(filters: FindEmployeesFilters) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.get<FindEmployeesPageResponse>(
        `${API_URL}/employee/get-all`,
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

  async getEmployeeProfileApi(id: number) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.get<GetEmployeeProfileResponseDto>(
        `${API_URL}/employee/profile/${id}`,
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
}

export type CreateEmployeeRequest = {
  name: string;
  email: string;
  groupType: GroupType;
  password?: string;
};

export type CreateEmployeeResponse = {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date | null;
};

export type UpdateEmployeeRequest = {
  name?: string;
  email?: string;
  groupType?: GroupType;
  id: number;
};

export type UpdateEmployeeResponse = {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date;
  employeeStatus: EmployeeStatus;
  department: {
    name: string;
  };
};

export type FindEmployeesFilters = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type FindEmployeesPageResponse = {
  data: FindEmployeeResponse[];
  meta: {
    totalPages: number;
  };
};

export type FindEmployeeResponse = {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date;
  employeeStatus: EmployeeStatus;
  department: {
    name: string;
  };
};

export type GetEmployeeProfileResponseDto = {
  id: number;
  name: string;
  email: string;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date;
  departmentId: number;
  employeeStatus: EmployeeStatus;
  departmentName: string | null;
  salaryHistory: {
    amount: number;
    updatedAt: Date;
    effectiveDate: Date;
    payFrequency: PayFrequency;
  }[];
};

enum EmployeeStatus {
  Active = "Active",
  Inactive = "Inactive",
  OnLeave = "OnLeave",
  Suspended = "Suspended",
  Probation = "Probation",
  Terminated = "Terminated",
}

export const {
  createEmployeeApi,
  deleteEmployeeApi,
  updateEmployeeApi,
  findEmployeesApi,
  getEmployeeProfileApi,
} = new EmployeeApi();
