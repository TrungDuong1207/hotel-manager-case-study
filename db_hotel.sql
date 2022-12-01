-- create database caseStudy;
use caseStudy;

-- create table rooms
-- (
-- roomId int primary key ,
-- descriptionRoom nvarchar(255),
-- imageRoom varchar(255),
-- categoryRoomId int not null,
-- status enum("empty","full") default "empty",
-- timeIn datetime NULL,
-- timeOut datetime NULL,
-- foreign key (categoryRoomId) references categoryRoom(categoryRoomId)
-- );

-- create table categoryRoom
-- (
-- categoryRoomId int primary key auto_increment,
-- categoryName enum("single", "double", "vip") not null,
-- price mediumint not null
-- );
-- CREATE TABLE `users` (
--   `userId` int NOT NULL,
--   `nameUser` varchar(55) NOT NULL,
--   `dateOfBirth` date DEFAULT NULL,
--   `email` varchar(55) NOT NULL,
--   `password` varchar(32) NOT NULL,
--   `phone` varchar(10) NOT NULL
-- )
-- insert into users
-- values(1,"Trung", "1996-07-12", "duongtrung1207@gmail.com", "a12345", "0123456789");
-- insert into users
-- values(2,"Khanh", "2003-09-13", "khanh@gmail.com", "a123456", "0123456788");

-- insert into categoryroom(categoryRoomId,categoryName,price)
-- values (1,"single", 400000);
-- insert into categoryroom(categoryRoomId,categoryName,price)
-- values (2,"double", 500000);
-- insert into categoryroom(categoryRoomId,categoryName,price)
-- values (3,"vip", 1000000);
-- SELECT * FROM casestudy.rooms;
/*
INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId, status, timeIn, timeOut)
VALUES(1001, "room for the people alone", "img/upload/abc1.jpg", 1, "full", "2022-11-28 08:00:00", "2022-11-30 18:00:00");
INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId, status, timeIn, timeOut)
VALUES(1002, "room for couple", "img/upload/ab10.jpg", 2, "empty", null, null);

INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId, status, timeIn, timeOut)
VALUES(1003, "room with full amenities", "img/upload/abc3.jpg", 3, "full", "2022-11-30 09:00:00", "2022-11-30 13:00:00");

INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId, status, timeIn, timeOut)
VALUES(1004, "luxury room", "img/upload/hotel-photography-chup-anh-khach-san-resort-kk-hotel-sapa-khach-san-kk-169-1.jpg", 3, "empty", null, null);

INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId, status, timeIn, timeOut)
VALUES(1005, "artist room", "img/upload/abc6.jpg", 2, "full", "2022-12-01 14:38:00", "2022-12-01 15:30:00");

INSERT INTO rooms(roomId, descriptionRoom, imageRoom, categoryRoomId, status, timeIn, timeOut)
VALUES(1006, "luxury room", "img/upload/ab8.jpg", 3, "empty", null, null);
*/

#ko cần chạy chỗ này
-- SELECT r.imageRoom, r.roomId, r.descriptionRoom, c.categoryName, c.price
-- from rooms r join categoryroom c on  r.categoryroomId = c.categoryroomId;

-- UPDATE rooms
-- SET roomId = 1000, descriptionRoom = "bc", imageRoom = "abc.js", categoryRoomId = 2
-- WHERE roomId = 1005;

-- UPDATE rooms SET status = "empty", timeIn = null, timeOut = null
-- WHERE roomId = 1112;

-- UPDATE rooms SET status = "full", timeIn = "2022-01-12 14:35:00", timeOut = "2022-01-12 15:35:00"
-- WHERE roomId = 1111;


