const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const ActiveDirectory = require('activedirectory2');

// .env config
require('dotenv').config();
const http_port = process.env.HTTP_PORT;
const https_port = process.env.HTTPS_PORT;
const domain = process.env.CERT_DOMAIN;

const app = express();

app.use(express.json());

app.use(cors({
    origin: [
        process.env.FRONT_CORS_DOMAIN
    ]
}));

app.post('/loginldap', async (request, response) => {
    //active directory
    const config = {
        url: `ldap://${process.env.LDAP_ADRESS}`,
        baseDN: process.env.BASE_DN,
        username: process.env.ADMIN_USER + process.env.LDAP_DOMAIN,
        password: process.env.ADMIN_PASSWORD
    };

    const ad = new ActiveDirectory(config);

    const username = request.body.email;
    const password = request.body.password;

    ad.authenticate(username + process.env.LDAP_DOMAIN, password, function (err, auth) {
        if (err) {
            //usuario ou senha incorretos
            console.log('ERROR1: ' + JSON.stringify(err));
            response.status(401).json({ error: 'unauthorized' });
            return;
        }

        if (auth) {
            console.log('Authenticated!');
            ad.findUser(username, function (err, user) {
                if (err) {
                    console.log('ERROR2: ' + JSON.stringify(err));
                    response.status(401).json();
                    return;
                }

                if (!user) {
                    console.log('User: ' + username + ' not found.');
                    response.status(401).json();
                } else {
                    const userData = {
                        name: user.cn,
                        username: user.userPrincipalName,
                        email: user.mail,
                        password: `${user.sAMAccountName}@${user.whenCreated}`
                    }
                    console.log(userData);
                    response.json(userData);
                }
            });
        }
        else {
            console.log('Authentication failed!');
        }
    });
});

//http server
app.listen(http_port, () => {
    console.log(`🛸 API HTTP iniciada na porta ${http_port}!`);
});

// https server

https.createServer({
    key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`),
    ca: fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`)
}, app).listen(https_port, () => console.log(`🚀 API HTTPS iniciada na porta ${https_port}!`));
