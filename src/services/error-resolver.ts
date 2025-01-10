import axios from "axios";

export function resolveErrorMessage(error: any) {
  let message = error.message;
  if (axios.isAxiosError(error)) {
    message = error.response?.data.message ?? message;
  }
  return message;
}
