const HandlerReadFile = require("../../handler/HandlerReadFile");
const HandlerSQL = require("../../handler/HandlerSQL");
const qs = require("qs");
class ManagerController {
    static async showlistManager(req, res) {
        let dataHTML = await HandlerReadFile.getTemplate("./views/manager.html");
        // const sqlShowOrders = `SELECT orderNumber, orderDate, status FROM orders;`;
        // let orders = await HandlerSQL.querySQL(sqlShowOrders);
        // let html = "";

        // orders.forEach((order, index) => {
        //     let date = new Date(order.orderDate);
        //     let orderDate = date.toLocaleString()
        //     html += "<tr>";
        //     html += `<td>${index + 1}</td>`;
        //     html += `<td>${order.orderNumber}</td>`;
        //     html += `<td>${orderDate}</td>`;
        //     html += `<td>${order.status}</td>`;
        //     html += `<td><a class="btn btn-primary" href="/order/detail?id=${order.orderNumber}">Detail</a></td>`;
        //     html += "</tr>";
        // });
        res.writeHead(200, { "Content-type": "text/html" });
        // dataHTML = dataHTML.replace("{order-list}", html);
        res.write(dataHTML);
        res.end();
    }

    
}

module.exports = ManagerController;