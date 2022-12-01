const BaseController = require("../../handler/base.controller");
const fs = require("fs");
const formidable = require('formidable');
const qs = require("qs");
let idRoom = 0;
class ManagerController {
    static async showListRoom(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/manager/manager.html");
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
            html += `<td><a class="btn btn-danger" href="manager/delete?id=${room.roomId}">Delete</a></td>`;
            html += `<td><a class="btn btn-primary" href="manager/edit?id=${room.roomId}">Edit</a></td>`;
            html += "</tr>";
        });
        res.writeHead(200, { "Content-type": "text/html" });
        dataHTML = dataHTML.replace("{manager-list}", html);
        res.write(dataHTML);
        res.end();
    }
    //add
    static async showAddPage(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/manager/add.html");
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
            // console.log(fields);
            // console.log(files);
            let oldpath = files.img.filepath;
            let newpath = form.uploadDir + files.img.originalFilename;
            let pathImg = "img/upload/" + files.img.originalFilename;
            fs.rename(oldpath, newpath, async function (err) {
                let sqlAdd = `INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId)
                            VALUES(${fields.roomId}, "${fields.description}", "${pathImg}", ${fields.cateRoom});`;
                await BaseController.querySQL(sqlAdd);
                res.writeHead(301, { Location: '/manager' });
                res.end();

            })
        })
    }
    //delete
    static async showDeletePage(req, res, urlParse) {
        let idDelete = qs.parse(urlParse.query).id;
        idRoom = idDelete;
        let deleteHTML = await BaseController.getTemplate("./views/manager/delete.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectRoom = `SELECT r.roomId, r.descriptionRoom, c.categoryName, c.price 
                            FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId 
                            WHERE r.roomId = ${idDelete};`;
        let rooms = await BaseController.querySQL(sqlSelectRoom);
        // console.log(rooms);
        deleteHTML = deleteHTML.replace("{name}", rooms[0].roomId);
        deleteHTML = deleteHTML.replace("{description}", rooms[0].descriptionRoom);
        deleteHTML = deleteHTML.replace("{cate}", rooms[0].categoryName);
        deleteHTML = deleteHTML.replace("{price}", rooms[0].price);
        res.write(deleteHTML);
        res.end();
    }

    static async deleteRoom(req, res) {
        // let idDelete = qs.parse(urlParse.query).id;
        const sqlDelete = `DELETE FROM rooms WHERE roomId = ${idRoom}`;
        await BaseController.querySQL(sqlDelete);
        res.writeHead(301, { Location: "/manager" });
        res.end();
    }
    //edit
    static async showEditPage(req, res, urlParse) {
        let idEdit = qs.parse(urlParse.query).id;
        idRoom = idEdit;
        let editHTML = await BaseController.getTemplate("./views/manager/update.html");
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
    //rented-checkout
    static async showRentedRoom(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/manager/rented/rented.html");
        const sqlShowRented = `SELECT r.roomId, r.descriptionRoom, c.categoryName, c.price, r.timeIn, r.timeOut 
                                FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId
                                WHERE status = "full";`;
        let rooms = await BaseController.querySQL(sqlShowRented);
        // console.log(rooms);
        let html = "";
        rooms.forEach((room, index) => {
            let dateIn = new Date(room.timeIn);
            let roomDateIn = dateIn.toLocaleString();
            let hoursIn = dateIn.getHours();
            let dayIn = dateIn.getDate();
            let dateOut = new Date(room.timeOut);
            let roomDateOut = dateOut.toLocaleString();
            let hoursOut = dateOut.getHours();
            let dayOut = dateOut.getDate();
            let totalMoney = 0
            // console.log(dayIn)
            // console.log(hoursOut);
            if (dayIn == dayOut) {
                let rentalTime = hoursOut - hoursIn;
                totalMoney = rentalTime * room.price;
            } else if (dayIn < dayOut) {
                let rentalTime = (24 - hoursIn) + 24 + hoursOut
                totalMoney = rentalTime * room.price;
            }
            html += "<tr>";
            html += `<td>${index + 1}</td>`;
            html += `<td>${room.roomId}</td>`;
            html += `<td>${room.descriptionRoom}</td>`;
            html += `<td>${room.categoryName}</td>`;
            html += `<td>${room.price}</td>`;
            html += `<td>${roomDateIn}</td>`;
            html += `<td>${roomDateOut}</td>`;
            html += `<td>${totalMoney}</td>`;
            html += `<td><a class="btn btn-danger" href="./rented/checkout?id=${room.roomId}">Check Out</a></td>`;
            html += "</tr>";
        });
        res.writeHead(200, { "Content-type": "text/html" });
        dataHTML = dataHTML.replace("{rented-list}", html);
        res.write(dataHTML);
        res.end();

    }

    static async showCheckOutRoom(req, res, urlParse) {
        let idRoomCheckOut = qs.parse(urlParse.query).id;
        idRoom = idRoomCheckOut;
        let checkOutHTML = await BaseController.getTemplate("./views/manager/rented/checkout.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectRoom = `SELECT r.roomId, r.descriptionRoom, c.categoryName, c.price 
                            FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId 
                            WHERE r.roomId = ${idRoomCheckOut};`;
        let rooms = await BaseController.querySQL(sqlSelectRoom);
        // console.log(rooms);
        checkOutHTML = checkOutHTML.replace("{name}", rooms[0].roomId);
        checkOutHTML = checkOutHTML.replace("{description}", rooms[0].descriptionRoom);
        checkOutHTML = checkOutHTML.replace("{cate}", rooms[0].categoryName);
        checkOutHTML = checkOutHTML.replace("{price}", rooms[0].price);
        res.write(checkOutHTML);
        res.end();
    }

    static async checkOutRoom(req, res) {
        const sqlCheckOut = `UPDATE rooms 
                            SET status = "empty", timeIn = null, timeOut = null 
                            WHERE roomId = ${idRoom}`;
        await BaseController.querySQL(sqlCheckOut);
        res.writeHead(301, { Location: "/manager/rented" });
        res.end();
    }
    //empty-booking
    static async showEmptyRoom(req, res) {
        let dataHTML = await BaseController.getTemplate("./views/manager/empty/emptyRoom.html");
        const sqlShowEmpty = `SELECT r.roomId, r.descriptionRoom, c.categoryName, c.price 
                                FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId
                                WHERE status = "empty";`;
        let rooms = await BaseController.querySQL(sqlShowEmpty);
        // console.log(rooms);
        let html = "";
        rooms.forEach((room, index) => {
            html += "<tr>";
            html += `<td>${index + 1}</td>`;
            html += `<td>${room.roomId}</td>`;
            html += `<td>${room.descriptionRoom}</td>`;
            html += `<td>${room.categoryName}</td>`;
            html += `<td>${room.price}</td>`;
            html += `<td><a class="btn btn-primary" href="./empty/booking?id=${room.roomId}">Booking</a></td>`;
            html += "</tr>";
        });
        res.writeHead(200, { "Content-type": "text/html" });
        dataHTML = dataHTML.replace("{empty-list}", html);
        res.write(dataHTML);
        res.end();

    }
    static async showbookingRoom(req, res, urlParse) {
        let idRoomBooking = qs.parse(urlParse.query).id;
        idRoom = idRoomBooking;
        let BookingHTML = await BaseController.getTemplate("./views/manager/empty/booking.html");
        res.writeHead(200, { "Content-type": "text/html" });
        const sqlSelectRoom = `SELECT r.roomId, r.descriptionRoom, c.categoryName, c.price 
                            FROM rooms r JOIN categoryroom c ON r.categoryRoomId = c.categoryRoomId 
                            WHERE r.roomId = ${idRoomBooking};`;
        let rooms = await BaseController.querySQL(sqlSelectRoom);
        // console.log(rooms);
        BookingHTML = BookingHTML.replace("{name}", rooms[0].roomId);
        BookingHTML = BookingHTML.replace("{description}", rooms[0].descriptionRoom);
        BookingHTML = BookingHTML.replace("{cate}", rooms[0].categoryName);
        BookingHTML = BookingHTML.replace("{price}", rooms[0].price);
        res.write(BookingHTML);
        res.end();
    }
    static async bookingRoom(req, res) {
        let data = ""
        req.on("data", chunk => {
            data += chunk;
        })

        req.on("end", async () => {
            let times = qs.parse(data);
            // console.log(times);
            const sqlBooking= `UPDATE rooms 
                                SET status = "full", timeIn = "${times.timeIn}", timeOut = "${times.timeOut}" 
                                WHERE roomId = ${idRoom};`;
            await BaseController.querySQL(sqlBooking);
            res.writeHead(301, { Location: "/manager/empty" });
            res.end();
        })

    }
}

module.exports = ManagerController;