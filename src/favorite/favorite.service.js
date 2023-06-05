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
exports.removeFavorite = exports.getFavorite = exports.countFavorites = exports.listFavorites = exports.createFavorite = void 0;
const service_service_1 = require("../service/service.service");
const db_server_1 = require("../utils/db.server");
const selectFavorite = {
    id: true,
    userId: true,
    serviceId: true,
    service: {
        select: service_service_1.selectService,
    },
};
const createFavorite = (serviceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFavorite = yield db_server_1.db.favorite.findFirst({
        where: {
            serviceId,
            userId,
        },
    });
    if (existingFavorite) {
        return existingFavorite;
    }
    return db_server_1.db.favorite.create({
        data: {
            service: {
                connect: { id: serviceId },
            },
            user: {
                connect: { id: userId },
            },
        },
    });
});
exports.createFavorite = createFavorite;
const listFavorites = (userId, skip, take, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        userId: { equals: userId },
        service: {
            OR: [
                { title: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { location: { contains: searchTerm } },
                { author: { username: { contains: searchTerm } } },
            ].filter(Boolean),
        },
    };
    const favorites = yield db_server_1.db.favorite.findMany({
        where,
        skip,
        take,
        include: {
            service: {
                select: service_service_1.selectService,
            },
        },
    });
    return favorites;
});
exports.listFavorites = listFavorites;
const countFavorites = (userId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const where = userId || searchTerm
        ? {
            AND: [
                userId ? { userId: { equals: userId } } : {},
                searchTerm
                    ? {
                        OR: [
                            { service: { title: { contains: searchTerm } } },
                            { service: { description: { contains: searchTerm } } },
                            { service: { location: { contains: searchTerm } } },
                            {
                                service: {
                                    author: { username: { contains: searchTerm } },
                                },
                            },
                        ],
                    }
                    : {},
            ].filter(Boolean),
        }
        : {};
    const count = yield db_server_1.db.favorite.count({ where });
    return count;
});
exports.countFavorites = countFavorites;
const getFavorite = (serviceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.favorite.findFirst({
        where: {
            serviceId: serviceId,
            userId: userId,
        },
        select: selectFavorite,
    });
});
exports.getFavorite = getFavorite;
const removeFavorite = (serviceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_server_1.db.favorite.deleteMany({
        where: {
            serviceId: serviceId,
            userId: userId,
        },
    });
});
exports.removeFavorite = removeFavorite;
