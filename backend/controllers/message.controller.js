import {Conversation} from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";
import {Message} from "../models/message.model.js"
import { User } from "../models/user.model.js";

// Feature for chat
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;
      
        const sender = await User.findById(senderId);
        
        const isFollowing = sender.following.includes(receiverId);
        const isFollower = sender.followers.includes(receiverId);

        if (!isFollowing && !isFollower) {
            return res.status(403).json({
                success: false,
                message: "You can only message users you follow or who follow you."
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
     
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        
        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        // Socket.io for real-time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        const senderUser = await User.findById(senderId).select('username profilePicture');
            const notification = {
                type: 'message',
                userId: senderId,
                userDetails: senderUser,
                message: 'sent you a new message.'
            };
            io.to(receiverSocketId).emit('notification', notification);

        return res.status(201).json({
            success: true,
            newMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


// For getting message
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
    }
}