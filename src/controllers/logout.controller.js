const fs = require("fs");
const qs = require("qs");
class LogoutController {
    static logOut(req, res) {
        let cookie = req.headers.cookie;
        let sessionID = qs.parse(cookie).uId;
        console.log(sessionID);
        fs.unlink(__dirname+"../../../sessions/"+sessionID+".json", (err) => {
            if (err) throw err.message;
            console.log("delete session complete");
        })
        res.writeHead(301, { Location: '/' })
        res.end();
    }
}

module.exports = LogoutController;