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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUserByUsername = exports.createUser = exports.getUserWithPassword = exports.getUserWithoutPassword = exports.listUsers = void 0;
const db_server_1 = require("../utils/db.server");
const readUserFields = {
    id: true,
    username: true,
    email: true,
    rating: true,
    biography: true,
    phoneNumber: true,
    fullName: true,
    gender: true,
    dateOfBirth: true,
    imageUrl: true,
};
const writeUserFields = {
    id: true,
    username: true,
    email: true,
    password: true,
    rating: true,
    biography: true,
    phoneNumber: true,
    fullName: true,
    gender: true,
    dateOfBirth: true,
    imageUrl: true,
};
const listUsers = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    if (searchTerm) {
        users = yield db_server_1.db.user.findMany({
            where: {
                username: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
            select: readUserFields,
        });
    }
    else {
        users = yield db_server_1.db.user.findMany({ select: readUserFields });
    }
    return users;
});
exports.listUsers = listUsers;
const getUserWithoutPassword = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findUnique({ where: { id }, select: readUserFields });
});
exports.getUserWithoutPassword = getUserWithoutPassword;
const getUserWithPassword = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findUnique({ where: { id }, select: writeUserFields });
});
exports.getUserWithPassword = getUserWithPassword;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.create({ data: user, select: writeUserFields });
});
exports.createUser = createUser;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findFirst({ where: { username }, select: writeUserFields });
});
exports.getUserByUsername = getUserByUsername;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findFirst({ where: { email }, select: writeUserFields });
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const rest = __rest(user, []);
    return db_server_1.db.user.update({
        where: { id },
        data: Object.assign({}, rest),
        select: writeUserFields,
    });
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_server_1.db.user.delete({ where: { id } });
});
exports.deleteUser = deleteUser;
function updateUserPassword(newPassword, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_server_1.db.user.update({
            where: { id: id },
            data: { password: newPassword },
        });
    });
}
exports.updateUserPassword = updateUserPassword;
