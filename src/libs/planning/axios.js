import Axios from "axios";
import { getCookie } from "cookies-next";

const axiosPlanning = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_PLANNING_SERVICE,
    headers: {
        Authorization: getCookie("auth"),
    },
});

export default axiosPlanning;
