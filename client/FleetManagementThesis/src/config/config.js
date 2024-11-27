// Import environment variables
const prodURL = process.env.REACT_APP_PROD_URL;
const devURL = process.env.REACT_APP_DEV_URL;

// Setting baseURL based on the environment
const baseURL = process.env.REACT_APP_ENV === "production" ? prodURL : devURL;

export default baseURL;
