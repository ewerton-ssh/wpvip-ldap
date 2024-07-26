import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from '../../services/api';
import apiLDAP from "../../services/ldap";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";




const Copyright = () => {
	return (
		<Typography variant="body2" color="primary" align="center">
			{"Copyright "}
			<Link color="primary" href="#">
				{nomeEmpresa} - v {versionSystem}
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		height: "100vh",
		//background: "linear-gradient(to right, #76EE00 , #76EE00 , #458B00)",
		backgroundImage: "url(https://i.imgur.com/CGby9tN.png)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		backgroundPosition: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
	paper: {
		backgroundColor: theme.palette.login, //DARK MODE PLW DESIGN//
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "55px 30px",
		borderRadius: "12.5px",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	powered: {
		color: "white"
	}
}));

//create whaticket user based ldap user
async function handleSaveLdapUser(userData, handleLogin){
	try{
		await api.post("/users", userData);
	} catch (error){

		const userExists = error.response.data.error;

		if(userExists === 'An user with this email already exists.'){
			// Login whaticket
			const ldapUser = { 
				email: userData.email, 
				password: userData.password
			};

			handleLogin(ldapUser);
		}
	}
}

//verify AD login
async function handleLoginLDAP(userData, handleLogin){
	try {
		const response = await apiLDAP.post('/loginldap', userData);

		const newUserLdapHeader = {
			name: response.data.name,
			email: response.data.email,
			password: response.data.password,
			profile:"user",
			companyId: response.data.companyId
		}

		if(!newUserLdapHeader.name || !newUserLdapHeader.email || !newUserLdapHeader.password){
			toast.error('Dados de domínio incompletos!')
		}

		handleSaveLdapUser(newUserLdapHeader, handleLogin);

	} catch (error) {
		const errorStatus = error.response.status;
		if(errorStatus === 401) {
			toast.error('Usuário ou senha incorretos!')
		}
		
	};
};

const LoginLDAP = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLoginLDAP(user, handleLogin);
	};

	return (
		<div className={classes.root}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<div>
						<img style={{ margin: "0 auto", width: "100%" }} src={logo} alt="Whats" />
					</div>
					{/*<Typography component="h1" variant="h5">
					{i18n.t("login.title")}
				</Typography>*/}
					<form className={classes.form} noValidate onSubmit={handlSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label={i18n.t("Usuário")}
							name="email"
							value={user.email}
							onChange={handleChangeInput}
							autoComplete="email"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label={i18n.t("login.form.password")}
							type="password"
							id="password"
							value={user.password}
							onChange={handleChangeInput}
							autoComplete="current-password"
						/>

						<Grid container justify="flex-end">
							<Grid item xs={6} style={{ textAlign: "right" }}>
									Esqueceu sua senha? Problema seu!
							</Grid>
						</Grid>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{i18n.t("login.buttons.submit")}
						</Button>
						
					</form>

				</div>
				<Box mt={8}><Copyright /></Box>
			</Container>
		</div>
	);
};

export default LoginLDAP;
