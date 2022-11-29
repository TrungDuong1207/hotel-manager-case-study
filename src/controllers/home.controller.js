let HandlerReadFile = require("../../handler/HandlerReadFile");
class HomeController{
    static async showHomepage(req, res){
        let dataHtml = await HandlerReadFile.getTemplate("./views/home.html");
        res.writeHead(200,  {"Content-type": "text/html"});
        res.write(dataHtml);
        res.end();
    }
}

module.exports = HomeController