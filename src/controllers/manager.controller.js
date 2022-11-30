const BaseController = require("../../handler/base.controller");
const fs = require("fs");
const formidable = require('formidable');
const qs = require("qs");
let idRoom = 0;
class ManagerController {
    static async showListRoom(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/manager.html");
        const sqlShowRoom = `SELECT roomId, descriptionRoom, status, timeIn, timeOut FROM rooms;`;
        let rooms = await BaseController.querySQL(sqlShowRoom);
        let html = "";
        rooms.forEach((room, index) => {
            let roomDateIn = "";
            let roomDateOut = "";
            if (room.status !== "empty") {
                let dateIn = new Date(room.timeIn);
                roomDateIn = dateIn.toLocaleString();
                let dateOut = new Date(room.timeOut);
                roomDateOut = dateOut.toLocaleString();
            }
            html += "<tr>";
            html += `<td>${index + 1}</td>`;
            html += `<td>${room.roomId}</td>`;
            html += `<td>${room.descriptionRoom}</td>`;
            html += `<td>${room.status}</td>`;
            html += `<td>${roomDateIn}</td>`;
            html += `<td>${roomDateOut}</td>`;
            html += `<td><a class="btn btn-primary" href="delete?id=${room.roomId}">Delete</a></td>`;
            html += `<td><a class="btn btn-primary" href="edit?id=${room.roomId}">Edit</a></td>`;
            html += "</tr>";
        });
        res.writeHead(200, { "Content-type": "text/html" });
        dataHTML = dataHTML.replace("{manager-list}", html);
        res.write(dataHTML);
        res.end();
    }
    static async showAddPage(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/add.html");
        res.writeHead(200, { "Content-type": "text/html" });
        res.write(dataHTML);
        res.end();
    }
    static async addRoom(req, res) {
        const form = formidable({ multiples: true });
        form.uploadDir = "views/img/upload/";
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }
            console.log(fields);
            // console.log(files);

            let oldpath = files.img.filepath;
            let newpath = form.uploadDir + files.img.originalFilename;

            fs.rename(oldpath, newpath, async function (err) {
                let sqlAdd = `INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId)
                            VALUES(${fields.roomId}, "${fields.description}", "${newpath}", ${fields.cateRoom});`;
                await BaseController.querySQL(sqlAdd);
                res.writeHead(301, { Location: '/manager' });
                res.end();

            })
        })
    }
    static async showDeletePage(req, res, urlParse) {
        let idDelete = qs.parse(urlParse.query).id;
        idRoom = idDelete;
        let deleteHTML = await BaseController.getTemplate("./views/delete.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectRoom = `SELECT r.roomId, r.descriptionRoom, c.categoryName, c.price 
                            FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId 
                            WHERE r.roomId = ${idDelete};`;
        let rooms = await BaseController.querySQL(sqlSelectRoom);
        console.log(rooms);
        deleteHTML = deleteHTML.replace("{name}", rooms[0].roomId);
        deleteHTML = deleteHTML.replace("{description}", rooms[0].descriptionRoom);
        deleteHTML = deleteHTML.replace("{cate}", rooms[0].categoryName);
        deleteHTML = deleteHTML.replace("{price}", rooms[0].price);
        res.write(deleteHTML);
        res.end();
    }

    static async deleteRoom(req, res, urlParse) {
        // let idDelete = qs.parse(urlParse.query).id;
        const sqlDelete = `DELETE FROM rooms WHERE roomId = ${idRoom}`;
        await BaseController.querySQL(sqlDelete);
        res.writeHead(301, { Location: "/manager" });
        res.end();
    }

    static async showEditPage(req, res, urlParse) {
        let idEdit = qs.parse(urlParse.query).id;
        idRoom = idEdit;
        let editHTML = await BaseController.getTemplate("./views/update.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectRoom = `SELECT roomId, descriptionRoom FROM rooms WHERE roomId = ${idEdit};`;
        let rooms = await BaseController.querySQL(sqlSelectRoom);
        editHTML = editHTML.replace("code", rooms[0].roomId);
        editHTML = editHTML.replace("desscription", rooms[0].descriptionRoom);
        res.write(editHTML);
        res.end();
    }
    static async editRoom(req, res) {
        const form = formidable({ multiples: true });
        form.uploadDir = "views/img/upload/";
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }
            console.log(fields);
            // console.log(files);
            let newpath = form.uploadDir + files.img.originalFilename;
            let sqlEdit = `UPDATE rooms
                        SET roomId = ${fields.roomId}, descriptionRoom = "${fields.description}", imageRoom = "${newpath}", categoryRoomId = ${fields.cateRoom}
                        WHERE roomId = ${idRoom};`
            await BaseController.querySQL(sqlEdit);
            res.writeHead(301, { Location: '/manager' });
            res.end();
        })
    }

}

module.exports = ManagerController;