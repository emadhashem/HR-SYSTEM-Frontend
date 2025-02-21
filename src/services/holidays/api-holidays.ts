import axios from "axios";
const NINJA_API_URL = "https://api.api-ninjas.com/v1/holidays?";

class HolidaysApi {
  private async getHolidaysApi() {
    const country = "EG";
    const { data } = await axios.get<GetHolidaysResponseDto[]>(
      `${NINJA_API_URL}country=${country}`,
      {
        headers: {
          "X-Api-Key": "sPfqXfwvpU+aA/CzSvYzSw==wl2d2X3j4MXlxrDN",
        },
      }
    );
    console.log("data : ", data);
    return data;
  }

  loadHolidaysFromStorage = async () => {
    const holidaysStr = localStorage.getItem("holidays");
    if (holidaysStr) {
      return await JSON.parse(holidaysStr);
    }
    return await this.getHolidaysApi().then((data) => {
      localStorage.setItem("holidays", JSON.stringify(data));
      return data;
    });
  };
}

export type GetHolidaysResponseDto = {
  country: string;
  date: string;
  name: string;
};

export const { loadHolidaysFromStorage } = new HolidaysApi();
