import axios from "axios";

const apiLDAP = axios.create({
	baseURL: "https://localhost:3070"
});

export default apiLDAP;