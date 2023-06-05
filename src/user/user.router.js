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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserService = __importStar(require("./user.service"));
const JWT_SECRET = process.env.JWT_SECRET;
exports.userRouter = express_1.default.Router();
const registerValidators = [
    (0, express_validator_1.body)('username').isString(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
];
// POST: Register a User
// Params: username, email, password
exports.userRouter.post('/register', registerValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = yield UserService.getUserByEmail(req.body.email);
    if (user) {
        return res.status(401).json({ error: `User already registered!` });
    }
    try {
        const { username, email, password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield UserService.createUser({
            username,
            email,
            password: hashedPassword,
        });
        return res
            .status(201)
            .json(`User ${newUser.username} registered successfully!`);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}));
const loginValidators = [
    (0, express_validator_1.body)('username').isString(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
];
// POST: Login a User
// Params: username, password
exports.userRouter.post('/login', loginValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body;
        const user = yield UserService.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: `User doesn't exist!` });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password!' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: '1h',
        });
        const userData = { id: user.id, username: user.username };
        return res.status(200).json({ token, user: userData });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
// GET: List of all Users
exports.userRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.searchTerm
            ? req.query.searchTerm
            : undefined;
        const decodedSearchTerm = searchTerm ? decodeURI(searchTerm) : undefined;
        const users = yield UserService.listUsers(decodedSearchTerm);
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
// GET: A single User by ID
exports.userRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        const user = yield UserService.getUserWithoutPassword(id);
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('User could not be found');
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
// PUT: Updating a User
exports.userRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id, 10);
    try {
        const user = req.body;
        const updatedUser = yield UserService.updateUser(user, id);
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
// DELETE: Delete a User based on the id
exports.userRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        yield UserService.deleteUser(id);
        return res.status(204).json('User has been successfully deleted');
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
const passwordValidators = [
    (0, express_validator_1.body)('currentPassword').isLength({ min: 8 }),
    (0, express_validator_1.body)('newPassword').isLength({ min: 8 }),
];
// PUT: Change Password of a User
// Params: currentPassword, newPassword
exports.userRouter.put('/change-password/:id', passwordValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id, 10);
    const { currentPassword, newPassword } = req.body;
    const user = yield UserService.getUserWithPassword(id);
    const isMatch = yield bcrypt_1.default.compare(currentPassword, (user === null || user === void 0 ? void 0 : user.password) ? user === null || user === void 0 ? void 0 : user.password : '');
    if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect current password!' });
    }
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield UserService.updateUserPassword(hashedNewPassword, id);
    return res.status(200).json('Password updated successfully');
}));
