const http = require("http");
const url = require("url");
const PORT = 8080;
const PATH = __dirname + "\\views";
const HomeController = require("./src/controllers/home.controller");
const AuthController = require("./src/controllers/auth.controller");
const ManagerController = require("./src/controllers/manager.controller");
const fs = require("fs");
const server = http.createServer((req, res) => {
    const urlParse = url.parse(req.url);
    const urlPathName = urlParse.pathname;
    let path = urlParse.path;
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
    const filesDefences = path.match(
        /\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot|\.webp|\.jpeg/
    );
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split(".")[1]];
        res.writeHead(200, { "Content-Type": extension });
        fs.createReadStream(PATH + req.url).pipe(res);
    } else {
        switch (urlPathName) {
            case "/":
                HomeController.showHomepage(req, res);
                break;
            case "/manager":
                ManagerController.showListRoom(req, res);
                break;
            case "/login":
                if (req.method === "GET") {
                    AuthController.showLoginPage(req, res);
                } else {
                    AuthController.login(req, res);
                }
                break;
            case "/logout":
                AuthController.logOut(req, res);
                HomeController.showHomepage(req, res);
                break;
            case "/add":
                if (req.method === "GET") {
                    ManagerController.showAddPage(req, res);
                } else {
                    ManagerController.addRoom(req, res);
                }
                break;
            case "/delete":
                if (req.method === "GET") {
                    ManagerController.showDeletePage(req, res, urlParse);
                } else {
                    ManagerController.deleteRoom(req, res, urlParse);
                }
                
                break;
            case "/edit":
                if (req.method === "GET") {
                    ManagerController.showEditPage(req, res, urlParse);
                } else {
                    ManagerController.editRoom(req, res);
                }
                break;
            default:
                res.write("404 Not found");
                res.end();
        }
    }
});

server.listen(PORT, "localhost", () => {
    console.log("listen localhost on port " + PORT);
})

