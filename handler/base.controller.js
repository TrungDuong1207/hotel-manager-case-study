const fs = require("fs");
const connection = require("../src/model/ConnectDB");
class BaseController {
    static getTemplate(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
    }
    static unlinkSession(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) throw err.message;
                console.log("delete session complete");
            })
        })
    }
    static querySQL(sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, (err, results) => {
                if (err) reject(err.message);
                resolve(results);
            })
        })
    }

    static async readImage(PATH, req, res, filesDefences) {
        let mimeTypes = {
            webp: "image/webp",
            jpg: "images/jpg",
            png: "images/png",
            jpeg: "images/jpeg",
            js: "text/javascript",
            css: "text/css",
            svg: "image/svg+xml",
            ttf: "font/ttf",
            woff: "font/woff",
            woff2: "font/woff2",
            eot: "application/vnd.ms-fontobject",
        };
        const extension = mimeTypes[filesDefences[0].toString().split(".")[1]];
        res.writeHead(200, { "Content-Type": extension });
        // let dataImg = await BaseController.getTemplate(PATH + req.url);
        // res.write(dataImg);
        // res.end();
        fs.createReadStream(PATH + req.url).pipe(res);
    }
}

module.exports = BaseController;
