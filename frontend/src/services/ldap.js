import axios from "axios";

const apiLDAP = axios.create({
	baseURL: process.env.LDAP_SERVICE_API
});

export default apiLDAP;