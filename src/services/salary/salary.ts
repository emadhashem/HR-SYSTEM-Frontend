import axios from "axios";
import { API_URL } from "../../shared/constants";
import { resolveErrorMessage } from "../error-resolver";

class SalaryApi {
  createSalaryApi = async (createSalaryRequestDto: CreateSalaryRequestDto) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post<CreateSalaryResponseDto>(
        `${API_URL}/salary/create`,
        createSalaryRequestDto,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  };

  deleteSalaryApi = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.delete(`${API_URL}/salary/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  };

  getSalaryHistoryApi = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get<GetSalaryHistoryResponseDto[]>(
        `${API_URL}/salary/history`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  };

  updateSalaryApi = async (
    id: number,
    updateSalaryRequestDto: UpdateSalaryRequestDto
  ) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.patch<UpdateSalaryResponseDto>(
        `${API_URL}/salary/update/${id}`,
        updateSalaryRequestDto,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  };
}

export enum PayFrequency {
  Monthly = "Monthly",
  BiWeekly = "BiWeekly",
  Weekly = "Weekly",
  Quarterly = "Quarterly",
  Annually = "Annually",
}

export type CreateSalaryRequestDto = {
  amount: number;
  payFrequency: PayFrequency;
  employeeId: number;
  effectiveDate: Date;
};

export type CreateSalaryResponseDto = {
  id: number;
  amount: number;
  payFrequency: PayFrequency;
  employeeId: number;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type GetCurrentSalaryResponse = {
  id: number;
  amount: number;
  payFrequency: PayFrequency;
  effectiveDate: Date;
  updatedAt: Date;
  employeeId: number;
};

export type GetSalaryHistoryOfEmployeeResponse = GetCurrentSalaryResponse[];

export type GetSalaryHistoryResponseDto = {
  id: number;
  amount: number;
  payFrequency: PayFrequency;
  effectiveDate: Date;
  updatedAt: Date;
  employeeId: number;
};

export type UpdateSalaryRequestDto = {
  payFrequency?: PayFrequency;
  effectiveDate?: Date;
};

export type UpdateSalaryResponseDto = {
  id: number;
  amount: number;
  payFrequency: PayFrequency;
  employeeId: number;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const {
  createSalaryApi,
  deleteSalaryApi,
  getSalaryHistoryApi,
  updateSalaryApi,
} = new SalaryApi();
