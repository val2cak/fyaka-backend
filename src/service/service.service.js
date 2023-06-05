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
exports.deleteService = exports.updateService = exports.createService = exports.getService = exports.countServices = exports.listServices = exports.selectService = void 0;
const db_server_1 = require("../utils/db.server");
exports.selectService = {
    id: true,
    title: true,
    description: true,
    location: true,
    price: true,
    date: true,
    people: true,
    author: {
        select: {
            id: true,
            username: true,
            email: true,
        },
    },
    categoryId: true,
};
const listServices = (authorId, skip, take, searchTerm, minPrice, maxPrice, minDate, maxDate, categoryIds, location, people, userRating) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        AND: [
            authorId ? { author: { id: { equals: authorId } } } : {},
            searchTerm
                ? {
                    OR: [
                        { title: { contains: searchTerm } },
                        { description: { contains: searchTerm } },
                        { location: { contains: searchTerm } },
                        { author: { username: { contains: searchTerm } } },
                    ],
                }
                : {},
            minPrice ? { price: { gte: minPrice } } : {},
            maxPrice ? { price: { lte: maxPrice } } : {},
            minDate ? { date: { gte: new Date(minDate) } } : {},
            maxDate ? { date: { lte: new Date(maxDate) } } : {},
            categoryIds ? { categoryId: { in: categoryIds } } : {},
            location ? { location: { contains: location } } : {},
            people ? { people: { equals: people } } : {},
            userRating ? { author: { rating: { gte: userRating } } } : {},
        ].filter(Boolean),
    };
    return db_server_1.db.service.findMany({ where, skip, take, select: exports.selectService });
});
exports.listServices = listServices;
const countServices = (authorId, searchTerm, minPrice, maxPrice, minDate, maxDate, categoryIds, location, people, userRating) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        AND: [
            authorId ? { author: { id: { equals: authorId } } } : {},
            searchTerm
                ? {
                    OR: [
                        { title: { contains: searchTerm } },
                        { description: { contains: searchTerm } },
                        { location: { contains: searchTerm } },
                        { author: { username: { contains: searchTerm } } },
                    ],
                }
                : {},
            minPrice ? { price: { gte: minPrice } } : {},
            maxPrice ? { price: { lte: maxPrice } } : {},
            minDate ? { date: { gte: new Date(minDate) } } : {},
            maxDate ? { date: { lte: new Date(maxDate) } } : {},
            categoryIds ? { categoryId: { in: categoryIds } } : {},
            location ? { location: { contains: location } } : {},
            people ? { people: { equals: people } } : {},
            userRating ? { author: { rating: { gte: userRating } } } : {},
        ].filter(Boolean),
    };
    return db_server_1.db.service.count({ where });
});
exports.countServices = countServices;
const getService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.service.findUnique({
        where: { id },
        select: exports.selectService,
    });
});
exports.getService = getService;
const createService = (service) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, location, price, date, people, authorId, categoryId, } = service;
    return db_server_1.db.service.create({
        data: {
            title,
            description,
            location,
            price,
            date,
            people,
            authorId,
            categoryId,
        },
        select: exports.selectService,
    });
});
exports.createService = createService;
const updateService = (service, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, location, price, date, people, authorId, categoryId, } = service;
    return db_server_1.db.service.update({
        where: { id },
        data: {
            title,
            description,
            location,
            price,
            date,
            people,
            authorId,
            categoryId,
        },
        select: exports.selectService,
    });
});
exports.updateService = updateService;
const deleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_server_1.db.service.delete({ where: { id } });
});
exports.deleteService = deleteService;
