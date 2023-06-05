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
exports.serviceRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const ServiceService = __importStar(require("./service.service"));
const router = express_1.default.Router();
exports.serviceRouter = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hasFilters = req.query.categoryId ||
        req.query.minPrice ||
        req.query.maxPrice ||
        req.query.minDate ||
        req.query.maxDate ||
        req.query.location ||
        req.query.people ||
        req.query.userRating ||
        req.query.searchTerm;
    try {
        const authorId = req.query.authorId
            ? parseInt(req.query.authorId, 10)
            : undefined;
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : undefined;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const skip = !hasFilters
            ? pageSize
                ? (page - 1) * pageSize
                : undefined
            : undefined;
        const searchTerm = req.query.searchTerm
            ? req.query.searchTerm
            : undefined;
        const decodedSearchTerm = searchTerm ? decodeURI(searchTerm) : undefined;
        const minPrice = req.query.minPrice
            ? parseInt(req.query.minPrice)
            : undefined;
        const maxPrice = req.query.maxPrice
            ? parseInt(req.query.maxPrice)
            : undefined;
        const minDate = req.query.minDate
            ? new Date(req.query.minDate)
            : undefined;
        const maxDate = req.query.maxDate
            ? new Date(req.query.maxDate)
            : undefined;
        const categoryId = req.query.categoryId
            ? Array.isArray(req.query.categoryId)
                ? req.query.categoryId.map((id) => parseInt(id, 10))
                : [parseInt(req.query.categoryId, 10)]
            : undefined;
        const location = req.query.location
            ? req.query.location
            : undefined;
        const people = req.query.people
            ? parseInt(req.query.people, 10)
            : undefined;
        const userRating = req.query.userRating
            ? parseFloat(req.query.userRating)
            : undefined;
        const [services, totalCount] = yield Promise.all([
            ServiceService.listServices(authorId, skip, pageSize, decodedSearchTerm, minPrice, maxPrice, minDate, maxDate, categoryId, location, people, userRating),
            ServiceService.countServices(authorId, decodedSearchTerm, minPrice, maxPrice, minDate, maxDate, categoryId, location, people, userRating),
        ]);
        const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;
        return res.status(200).json({ services, totalPages });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        const service = yield ServiceService.getService(id);
        if (service) {
            return res.status(200).json(service);
        }
        return res.status(404).json('Service could not be found');
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
const validateService = [
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('description').isString(),
    (0, express_validator_1.check)('location').isString(),
    (0, express_validator_1.check)('price').isInt(),
    (0, express_validator_1.check)('date').isISO8601(),
    (0, express_validator_1.check)('people').isInt(),
    (0, express_validator_1.check)('authorId').isInt(),
];
router.post('/', validateService, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const service = req.body;
        const newService = yield ServiceService.createService(service);
        return res.status(201).json(newService);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
router.put('/:id', validateService, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id, 10);
    try {
        const service = req.body;
        const updatedService = yield ServiceService.updateService(service, id);
        return res.status(201).json(updatedService);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        yield ServiceService.deleteService(id);
        return res.status(204).json('Service has been successfully deleted');
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
