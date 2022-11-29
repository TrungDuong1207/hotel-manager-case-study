const HandlerReadFile = require("../../handler/HandlerReadFile");
const fs = require("fs");
const qs = require("qs");
const HandlerSQL = require("../../handler/HandlerSQL");
class LoginController {
    static async showLoginPage(req, res) {
        let cookie = req.headers.cookie;
        let sessionID = qs.parse(cookie).uId;
        let dataFormLogin = await HandlerReadFile.getTemplate('./views/login.html');
        if (sessionID) {
            let dataSession = await HandlerReadFile.getTemplate("sessions/" + sessionID + ".json");
            let expiresSession = JSON.parse(dataSession).expires;
            let now = Date.now();
            if (expiresSession < now) {
                fs.unlink(sessionID+".json",(err) => {
                        if(err) throw err.message;
                        console.log("delete session complete");
                })
                res.writeHead(200, { "Content-type": "text/html" })
                res.write(dataFormLogin)
                res.end();
            } else {
                res.writeHead(301, { Location: '/manager' })
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
            let result= await HandlerSQL.querySQL(sql);
            console.log(result);
            if(result[0].count == 0){
                res.writeHead(301, { Location: '/login' })
                res.end();
            } else {
                let data = {
                    user: {
                        email: dataParse.email,
                        password: dataParse.password
                    },
                    expires: Date.now() + 60 *60* 1000 * 2
                }
                let sessionID = Date.now(); 
                let session = JSON.stringify(data);
                fs.writeFile('sessions/' + sessionID + ".json", session, err => {
                    if (err) {
                        throw new Error(err.message)
                    }
                })
                //gửi cookie và lưu trên client
                res.setHeader('Set-Cookie',  "uId="+JSON.stringify(sessionID));
                res.writeHead(301, {Location: '/manager'});
                res.end();
            }

        })



    }
}
module.exports = LoginController;