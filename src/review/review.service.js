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
exports.countReviews = exports.getReviewsByUserId = exports.createReview = void 0;
const client_1 = require("@prisma/client");
const db_server_1 = require("../utils/db.server");
const prisma = new client_1.PrismaClient();
const createReview = (authorId, userId, rating, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield prisma.review.create({
            data: {
                authorId,
                userId,
                rating,
                text,
            },
        });
        // Calculate average user rating
        const reviews = yield prisma.review.findMany({
            where: {
                userId,
            },
        });
        const totalRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = totalRatings / reviews.length;
        // Update user's rating
        yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                rating: averageRating,
            },
        });
        return review;
    }
    catch (error) {
        console.error('Error creating review:', error);
        throw new Error('Failed to create review');
    }
});
exports.createReview = createReview;
const getReviewsByUserId = (userId, skip, take) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield prisma.review.findMany({
            where: {
                userId,
            },
            skip,
            take,
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                userId: true,
                rating: true,
                text: true,
            },
        });
        return reviews;
    }
    catch (error) {
        console.error('Error getting reviews by userId:', error);
        throw new Error('Failed to get reviews');
    }
});
exports.getReviewsByUserId = getReviewsByUserId;
const countReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const where = userId
        ? { userId: { equals: userId } }
        : {};
    const count = yield db_server_1.db.review.count({ where });
    return count;
});
exports.countReviews = countReviews;
