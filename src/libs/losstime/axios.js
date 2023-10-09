import Axios from "axios";

const axiosLosstime = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_LOSS_TIME_SERVICE,
});

export default axiosLosstime;
