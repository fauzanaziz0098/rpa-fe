import Axios from "axios";

const axiosAuth = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_AUTH_SERVICE,
});

export default axiosAuth;
