import type { AxiosRequestConfig } from "axios";
import { config as dotenvConfig } from "dotenv";
// export const BASE_URL = "/api";
dotenvConfig();
export const AXIOS_CONFIG: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
  },
};
