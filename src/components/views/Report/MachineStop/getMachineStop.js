import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
import axiosLosstime from "../../../../libs/losstime/axios";

export const getMachineStop = () => {
  const index = (query = null) =>
    axiosLosstime.get(`/loss-time?${query ?? ""}`, getHeaderConfigAxios());
  return {
    index,
  };
};
