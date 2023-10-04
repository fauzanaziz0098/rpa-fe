import Axios from "axios";
import { getCookie } from "cookies-next";

const axiosHour = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVICE_PER_HOUR,
    headers: {
        Authorization: getCookie("auth"),
    },
});

export default axiosHour;
