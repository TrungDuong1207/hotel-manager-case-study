const http = require("http");
const url = require("url");
const PORT = 3000;
const PATH = __dirname + "\\views";
const HomeController = require("./src/controllers/home.controller");
const LoginController = require("./src/controllers/login.controller");
const ManagerController = require("./src/controllers/manager.controller");
const LogoutController = require("./src/controllers/logout.controller");
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
                ManagerController.showlistManager(req, res);
                break;
            case "/login":
                if (req.method === "GET") {
                    LoginController.showLoginPage(req, res);
                } else {
                    LoginController.login(req, res);
                }
                break;
            case "/logout":
                LogoutController.logOut(req, res);
                break;
            default:
                res.write("404 Not found");
                res.end();
        }


    }
});

server.listen(3000, "localhost", () => {
    console.log("listen localhost on port" + PORT);
})