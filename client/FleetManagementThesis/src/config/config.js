// API URLS

// prodURL for deployed app
const prodURL = "https://thesis-api-bmpc.onrender.com";

// devURL for localhost
const devURL = "http://localhost:7000/api/v1";

// Setting baseURL either prodURL or devURL
const baseURL = process.env.NODE_ENV === "production" ? prodURL : devURL;

export default baseURL;
