import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

// Upload a new Story
// Cloudinary upto 100mb for the video and for the image it is 10mb
export const addStory = async (req, res) => {
    try {
        const file = req.file;
        const authorId = req.id;

        if (!file) return res.status(400).json({ message: 'File required' });

        let cloudResponse;

        if (file.mimetype.startsWith('video/')) {
            cloudResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "video" },
                    (error, result) => {
                        if (error) {
                            console.log("Cloudinary Video Error:", error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(file.buffer);
            });
        } else {
            const optimizedImageBuffer = await sharp(file.buffer)
                .resize({ width: 1080, height: 1920, fit: 'inside' }) 
                .toFormat('webp', { quality: 80 })
                .toBuffer();
            
            const fileUri = `data:image/webp;base64,${optimizedImageBuffer.toString('base64')}`;
            
            cloudResponse = await cloudinary.uploader.upload(fileUri, {
                resource_type: "image",
            });
        }

        const story = await Story.create({
            mediaUrl: cloudResponse.secure_url,
            author: authorId
        });

        await story.populate({ path: 'author', select: 'username profilePicture' });

        return res.status(201).json({
            message: 'Story uploaded successfully',
            story,
            success: true
        });
    } catch (error) {
        console.log("Story Upload Catch Error:", error);
        return res.status(500).json({ message: "Server error during story upload", success: false });
    }
};




// Get stories from users you follow + your own
export const getStories = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const user = await User.findById(loggedInUserId);
        
        const stories = await Story.find({
            author: { $in: [...user.following, loggedInUserId] }
        })
        .populate({ path: 'author', select: 'username profilePicture' })
        .sort({ createdAt: -1 }); 

        return res.status(200).json({
            stories,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Add this to the bottom of story.controller.js
export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const authorId = req.id;

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ message: 'Story not found', success: false });

        // Check if the logged-in user is the owner
        if (story.author.toString() !== authorId) {
            return res.status(403).json({ message: 'Unauthorized', success: false });
        }

        await Story.findByIdAndDelete(storyId);

        return res.status(200).json({ message: 'Story deleted successfully', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
