import axios from "axios";
import { API_URL } from "../../shared/constants";
import { Employee } from "../../shared/employee-types";
import { resolveErrorMessage } from "../error-resolver";

class Login {
  async login(email: string, password: string) {
    try {
      const { data } = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      return data;
    } catch (error) {
      const message = resolveErrorMessage(error);
      throw new Error(message);
    }
  }
}

export type LoginResponse = {
  accessToken: string;
  type: string;
  employee: Employee;
};

export const { login: loginApi } = new Login();
