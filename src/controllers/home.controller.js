let BaseController = require("../../handler/base.controller");
let qs = require("qs");
class HomeController {
    static async showHomepage(req, res) {
        let dataHtml = await BaseController.getTemplate("./views/home/home.html");
        let sqlShowHome = `SELECT r.imageRoom, r.roomId, r.descriptionRoom, c.categoryName, c.price
                        FROM rooms r JOIN categoryroom c on  r.categoryroomId = c.categoryroomId;`;
        let rooms = await BaseController.querySQL(sqlShowHome);
        console.log(rooms);
        let html = "";
        rooms.forEach((room, index) => {
            html += `
                        <div class="card m-1" style="width: 18rem;">
                            <div class="card-body">
                            <img src=".//${room.imageRoom}" class="card-img-top">
                                <h5 class="card-title">ROOM ${room.roomId}</h5>
                                <p class="card-text "><b>Category:</b> ${room.categoryName}</p>
                                <p class="card-text"><b>Description:</b> ${room.descriptionRoom}</p>
                                <p class="card-text"><b>Price (VND/1h):</b> ${room.price}</p>
                                <a href="/detail?id=${room.roomId}" class="btn btn-primary">Detail</a>
                            </div>
                        </div>`
        });

        res.writeHead(200, { "Content-type": "text/html" });
        dataHtml = dataHtml.replace("{list-room}", html);
        res.write(dataHtml);
        res.end();
    }

    static async showDetail(req, res, urlParse) {
        let idDetail = qs.parse(urlParse.query).id;
        let detailHTML = await BaseController.getTemplate("./views/home/detail.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectRoom = `SELECT r.roomId, r.descriptionRoom, r.imageRoom, c.categoryName, c.price 
                            FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId 
                            WHERE r.roomId = ${idDetail};`;
        let rooms = await BaseController.querySQL(sqlSelectRoom);
        // console.log(rooms);
        detailHTML = detailHTML.replace("{name}", rooms[0].roomId);
        detailHTML = detailHTML.replace("{description}", rooms[0].descriptionRoom);
        detailHTML = detailHTML.replace("{cate}", rooms[0].categoryName);
        detailHTML = detailHTML.replace("{price}", rooms[0].price);
        detailHTML = detailHTML.replace("{img-detail}", rooms[0].imageRoom);
        res.write(detailHTML);
        res.end();
    }
}

module.exports = HomeController