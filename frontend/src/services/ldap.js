import axios from "axios";
import ldap_host from "../../ldap_host.json"

const apiLDAP = axios.create({
	baseURL: ldap_host.ip
});

export default apiLDAP;