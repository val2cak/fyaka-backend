"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteRouter = void 0;
const express_1 = __importDefault(require("express"));
const FavoriteService = __importStar(require("./favorite.service"));
const router = express_1.default.Router();
exports.favoriteRouter = router;
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId, userId } = req.body;
        const favorite = yield FavoriteService.createFavorite(serviceId, userId);
        return res.status(201).json(favorite);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId, 10);
    try {
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : 6;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const skip = !req.query.searchTerm
            ? pageSize
                ? (page - 1) * pageSize
                : undefined
            : undefined;
        const searchTerm = req.query.searchTerm
            ? req.query.searchTerm
            : undefined;
        const decodedSearchTerm = searchTerm ? decodeURI(searchTerm) : undefined;
        const favorites = yield FavoriteService.listFavorites(userId, skip, pageSize, decodedSearchTerm);
        const totalCount = yield FavoriteService.countFavorites(userId, decodedSearchTerm);
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ favorites, totalPages });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
router.get('/:userId/:serviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId, 10);
    const serviceId = parseInt(req.params.serviceId, 10);
    try {
        const favorite = yield FavoriteService.getFavorite(Number(serviceId), Number(userId));
        return res.status(200).json(favorite);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId, userId } = req.body;
        const favorite = yield FavoriteService.removeFavorite(Number(serviceId), Number(userId));
        res.json(favorite);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete favorite' });
    }
}));
