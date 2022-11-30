let BaseController = require("../../handler/base.controller");
class HomeController {
    static async showHomepage(req, res) {
        let dataHtml = await BaseController.getTemplate("./views/home.html");
        // let sqlShowHome = `SELECT r.imageRoom, r.roomId, r.descriptionRoom, c.categoryName, c.price
        //                 FROM rooms r JOIN categoryroom c on  r.categoryroomId = c.categoryroomId;`;
        // let rooms = await HandlerSQL.querySQL(sqlShowHome);
        // // console.log(rooms);
        // let html = "";
        // rooms.forEach((room, index) => {
        //     html += `
        //                 <div class="card m-1" style="width: 18rem;">
        //                     <img src="\\img\\upload\\${room.imageRoom}" class="card-img-top">
        //                     <div class="card-body">
        //                         <h5 class="card-title">ROOM ${room.roomId}</h5>
        //                         <p class="card-text">${room.categoryName}</p>
        //                         <p class="card-text">${room.descriptionRoom}</p>
        //                         <a href="#">Price: ${room.price}</a>
        //                     </div>
        //                 </div>`
        // });

        res.writeHead(200, { "Content-type": "text/html" });

        // dataHtml = dataHtml.replace("{list-room}", html);
        res.write(dataHtml);
        res.end();
    }
}

module.exports = HomeController