import { GroupType } from "../../shared/employee-types";
import { resolveErrorMessage } from "../error-resolver";
import axios from "axios";
import { API_URL } from "../../shared/constants";

class DepartmentApi {
  async getDepartmentsWithEmployeesApi() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.get<
        GetAllDepartmentsWithEmployeesResponseDto[]
      >(`${API_URL}/department/all/with-employees`, {
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

  async createDepartmentApi(
    createDepartmentRequestDto: CreateDepartmentRequestDto
  ) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${API_URL}/department/create`,
        createDepartmentRequestDto,
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

  async deleteDepartmentApi(id: number) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${API_URL}/department/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  }

  async updateDepartmentApi(
    id: number,
    updateDepartmentRequestDto: UpdateDepartmentRequestDto
  ) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log(updateDepartmentRequestDto);
      const { data } = await axios.patch<UpdateDepartmentResponseDto>(
        `${API_URL}/department/update/${id}`,
        {
          name: updateDepartmentRequestDto.name,
          employees: updateDepartmentRequestDto.employees,
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
}

export type DepartmentEmployees = {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
};

export type GetAllDepartmentsResponseDto = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetAllDepartmentsWithEmployeesResponseDto =
  GetAllDepartmentsResponseDto & {
    employees: DepartmentEmployees[];
  };

export type CreateDepartmentRequestDto = {
  name: string;
};

export type CreateDepartmentResponseDto = {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  employees: any[];
};

export type UpdateDepartmentRequestDto = {
  name: string;
  employees: number[];
};

export type UpdateDepartmentResponseDto = {
  name: string;
  id: number;
  updatedAt: Date;
  employees: DepartmentEmployees[];
};

export const {
  getDepartmentsWithEmployeesApi,
  createDepartmentApi,
  deleteDepartmentApi,
  updateDepartmentApi,
} = new DepartmentApi();
