const http = require("http");
const url = require("url");
const PORT = 8080;
const PATH = __dirname + "\\views";
const BaseController = require("./handler/base.controller");
const HomeController = require("./src/controllers/home.controller");
const AuthController = require("./src/controllers/auth.controller");
const ManagerController = require("./src/controllers/manager.controller");
const UserController = require("./src/controllers/user.controller");
const server = http.createServer((req, res) => {
    const urlParse = url.parse(req.url);
    const urlPathName = urlParse.pathname;
    let path = urlParse.path;

    const filesDefences = path.match(
        /\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot|\.webp|\.jpeg/
    );
    if (filesDefences) {
        console.log("pathname" + urlPathName);
        BaseController.readImage(PATH, req, res, filesDefences);
    } else {
        switch (urlPathName) {
            case "/":
                HomeController.showHomepage(req, res);
                break;
            case "/detail":
                HomeController.showDetail(req, res, urlParse);
                break;
            case "/users":
                UserController.showListUser(req, res);
                break;
            case "/user/edit":
                if (req.method === "GET") {
                    UserController.showEditUser(req, res, urlParse);
                } else {
                    UserController.updateUser(req, res);
                }
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
            case "/manager/delete":
                if (req.method === "GET") {
                    ManagerController.showDeletePage(req, res, urlParse);
                } else {
                    ManagerController.deleteRoom(req, res, urlParse);
                }
                break;
            case "/manager/edit":
                if (req.method === "GET") {
                    ManagerController.showEditPage(req, res, urlParse);
                } else {
                    ManagerController.editRoom(req, res);
                }
                break;
            case "/manager/rented":
                ManagerController.showRentedRoom(req, res);
                break;
            case "/manager/empty":
                ManagerController.showEmptyRoom(req, res);
                break;
            case "/manager/rented/checkout":
                if (req.method === "GET") {
                    ManagerController.showCheckOutRoom(req, res, urlParse);
                } else {
                    ManagerController.checkOutRoom(req, res);
                }
                break;
            case "/manager/empty/booking":
                if (req.method === "GET") {
                    ManagerController.showbookingRoom(req, res, urlParse);
                } else {
                    ManagerController.bookingRoom(req, res);
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

