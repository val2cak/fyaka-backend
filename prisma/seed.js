"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_server_1 = require("../src/utils/db.server");
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(getUsers().map((user) => {
            return db_server_1.db.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                },
            });
        }));
        const user = yield db_server_1.db.user.findFirst({
            where: {
                username: 'username',
            },
        });
        yield Promise.all(getServices().map((service) => {
            const { title, description, location, price, date, people, categoryId } = service;
            return db_server_1.db.service.create({
                data: {
                    title,
                    description,
                    location,
                    price,
                    date,
                    people,
                    authorId: user === null || user === void 0 ? void 0 : user.id,
                    categoryId,
                },
            });
        }));
    });
}
seed();
function getUsers() {
    return [
        {
            username: 'username',
            email: 'email',
            password: 'password',
        },
    ];
}
function getServices() {
    return [
        {
            title: 'Service',
            description: 'Service',
            location: 'Split',
            price: 30,
            date: new Date(),
            people: 1,
            categoryId: 1,
        },
    ];
}
