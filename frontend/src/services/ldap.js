import axios from "axios";

const apiLDAP = axios.create({
	baseURL: "http://localhost:3060"
});

export default apiLDAP;