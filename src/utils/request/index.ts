import AppRequest from "./request";

const BASE_URL = process.env.TARO_APP_API_URL || "";
const TIME_OUT = 10000;
const appRequest = new AppRequest(BASE_URL, TIME_OUT);

export default appRequest;
