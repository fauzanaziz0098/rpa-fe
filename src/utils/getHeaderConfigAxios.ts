import type { AxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

export const getHeaderConfigAxios = (
  req: any,
  res: any
): AxiosRequestConfig => {
  if (req && res) {
    return {
      headers: {
        Authorization: getCookie("auth", { req, res }) ?? "",
      },
    };
  } else {
    return {
      headers: {
        Authorization: getCookie("auth") ?? "",
      },
    };
  }
};
