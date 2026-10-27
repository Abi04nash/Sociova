import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addStory, getStories, deleteStory } from "../controllers/story.controller.js";

const router = express.Router();

router.route('/add').post(isAuthenticated, upload.single('image'), addStory);
router.route('/all').get(isAuthenticated, getStories);
router.route('/delete/:id').delete(isAuthenticated, deleteStory);

export default router;
