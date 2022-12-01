const BaseController = require("../../handler/base.controller");
const fs = require("fs");
const formidable = require('formidable');
const qs = require("qs");
let idUser = 0;
class UserController {
    static async showListUser(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/user/user.html");
        const sqlShowUser = `SELECT userId, nameUser, dateOfBirth, email, phone FROM users;`;
        let users = await BaseController.querySQL(sqlShowUser);
        let html = "";
        users.forEach((user, index) => {
            let date = new Date(user.dateOfBirth);
            let dateOfBirth = date.toLocaleDateString();
            html += "<tr>";
            html += `<td>${index + 1}</td>`;
            html += `<td>${user.nameUser}</td>`;
            html += `<td>${dateOfBirth}</td>`;
            html += `<td>${user.email}</td>`;
            html += `<td>${user.phone}</td>`;
            html += `<td><a class="btn btn-primary" href="user/edit?id=${user.userId}">Edit</a></td>`;
            html += "</tr>";
        });
        res.writeHead(200, { "Content-type": "text/html" });
        dataHTML = dataHTML.replace("{users-list}", html);
        res.write(dataHTML);
        res.end();
    }

    static async showEditUser(req, res, urlParse) {
        let idEdit = qs.parse(urlParse.query).id;
        idUser = idEdit;
        let editHTML = await BaseController.getTemplate("./views/user/editUserPage.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectUser = `SELECT userId, nameUser, dateOfBirth, email, phone FROM users WHERE userId = ${idEdit};`;
        let users = await BaseController.querySQL(sqlSelectUser);
        console.log(users);
        // let dateUser = new Date(users[0].dateOfBirth).toDateString();
        editHTML = editHTML.replace("{code}", users[0].userId);
        editHTML = editHTML.replace("{name}", users[0].nameUser);
        editHTML = editHTML.replace("{email}", users[0].email);
        editHTML = editHTML.replace("{date}", users[0].dateOfBirth);
        editHTML = editHTML.replace("{phone}", users[0].phone);
        res.write(editHTML);
        res.end();
    }

    static async updateUser(req, res) {
        let data = ""
        req.on("data", chunk => {
            data += chunk;
        })

        req.on("end", async () => {
            let users = qs.parse(data);
            console.log(users);
            console.log(idUser);
            const sqlUpdate= `UPDATE users 
                                SET nameUser = "${users.nameUser}", phone = "${users.phoneUser}"
                                WHERE userId = ${idUser};`;
            await BaseController.querySQL(sqlUpdate);
            res.writeHead(301, { Location: "/users" });
            res.end();
        })

    }

}

module.exports = UserController;