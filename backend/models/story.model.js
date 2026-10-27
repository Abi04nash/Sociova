import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    mediaUrl: { 
        type: String, 
        required: true 
    },
    // ✅ TTL Time-To-Live Index MongoDB will auto-delete this document after 24 hours (86400 seconds)
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 
    } 
});

export const Story = mongoose.model('Story', storySchema);