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
exports.deleteCategory = exports.updateCategories = exports.createCategories = exports.getCategory = exports.listCategories = exports.selectCategory = void 0;
const db_server_1 = require("../utils/db.server");
exports.selectCategory = {
    id: true,
    name: true,
};
const listCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.category.findMany({ select: exports.selectCategory });
});
exports.listCategories = listCategories;
const getCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.category.findUnique({
        where: { id },
        select: exports.selectCategory,
    });
});
exports.getCategory = getCategory;
const createCategories = (categories) => __awaiter(void 0, void 0, void 0, function* () {
    const createData = categories.map((category) => ({
        name: category.name,
    }));
    yield db_server_1.db.category.createMany({
        data: createData,
    });
    return db_server_1.db.category.findMany({
        select: exports.selectCategory,
    });
});
exports.createCategories = createCategories;
const updateCategories = (categories) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = categories.map((category) => ({
        where: { id: category.id },
        data: { name: category.name },
    }));
    const updatedCategories = yield Promise.all(updateData.map((data) => db_server_1.db.category.update({
        where: data.where,
        data: data.data,
        select: exports.selectCategory,
    })));
    return updatedCategories;
});
exports.updateCategories = updateCategories;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_server_1.db.category.delete({ where: { id } });
});
exports.deleteCategory = deleteCategory;
