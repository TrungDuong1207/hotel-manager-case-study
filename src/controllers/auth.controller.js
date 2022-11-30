const BaseController = require("../../handler/base.controller");
const fs = require("fs");
const qs = require("qs");

class AuthController {
    static async showLoginPage(req, res) {
        let cookie = req.headers.cookie;
        let sessionID = qs.parse(cookie).uId;
        let dataFormLogin = await BaseController.getTemplate('./views/login.html');
        let file = "sessions/" + sessionID + ".json";
        console.log(file);
        if (sessionID) {
            try {
                let dataSession = await BaseController.getTemplate(file);
                let expiresSession = JSON.parse(dataSession).expires;
                let now = Date.now();
                if (expiresSession < now) {
                    fs.unlink(sessionID + ".json", (err) => {
                        if (err) throw err.message;
                        console.log("delete session complete");
                    })
                    res.writeHead(200, { "Content-type": "text/html" })
                    res.write(dataFormLogin)
                    res.end();
                } else {
                    res.writeHead(301, { Location: '/manager' })
                    res.end();
                }
            } catch {
                res.writeHead(200, { "Content-type": "text/html" });
            res.write(dataFormLogin);
            res.end();
            }
        } else {
            res.writeHead(200, { "Content-type": "text/html" });
            res.write(dataFormLogin);
            res.end();
        }
    }

    static async login(req, res) {
        let dataUser = "";
        req.on("data", (chunk) => {
            dataUser += chunk;
        })
        req.on("end", async () => {
            //kiểm tra user có trong database ko
            let dataParse = qs.parse(dataUser);
            let sql = `SELECT COUNT(email) AS "count" FROM users WHERE email ="${dataParse.email}" AND password ="${dataParse.password}"`;
            let result = await BaseController.querySQL(sql);
            if (result[0].count == 0) {
                res.writeHead(301, { Location: '/login' })
                res.end();
            } else {
                let data = {
                    user: {
                        email: dataParse.email,
                        password: dataParse.password
                    },
                    expires: Date.now() + 60 * 60 * 1000 * 2
                }
                let sessionID = Date.now();
                let session = JSON.stringify(data);
                fs.writeFile('sessions/' + sessionID + ".json", session, err => {
                    if (err) {
                        throw new Error(err.message)
                    }
                })
                //gửi cookie và lưu trên client
                res.setHeader('Set-Cookie', "uId=" + JSON.stringify(sessionID));
                res.writeHead(301, { Location: '/manager' });
                res.end();
            }

        })



    }

    static async logOut(req, res) {
        let cookie = req.headers.cookie;
        let sessionID = qs.parse(cookie).uId;
        console.log(sessionID);

        await BaseController.unlinkSession(__dirname + "..\\..\\..\\sessions\\" + sessionID + ".json");

    }
}

module.exports = AuthController;