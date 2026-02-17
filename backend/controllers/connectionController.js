const { connection } = require("mongoose");
const Connection = require("../models/Connections");

exports.createConnection = async (req, res) => {
    try {
        console.log("USER ID:", req.userId);
        console.log("BODY:", req.body);

        // const data= {
        //     senderId: req.userId,
        //     ...req.body
        // }
        // console.log(data)

        const connections = await Connection.create({
            senderId: req.userId,
            ...req.body

        });

        console.log("SAVED CONNECTION :", connections);
        console.log("SENDER:", req.userId);
        console.log("RECEIVER:", req.body.receiverId);


        res.status(201).json({
            message: "Connection saved successfully",
            connections
        });

    } catch (error) {
        console.error("SAVE ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
};
exports.getInvitations = async (req, res) => {
    try {

        const userId = req.userId;
        console.log("Receiver user id :", userId);

        const invitations = await Connection.find({
            receiverId: userId,
            senderId: userId
            // status: "pending"
        }).populate({
            path: "senderId",
            select:"name email"
        });

        
        console.log("invitations found :" ,invitations.length);
        console.log("invitations are :", invitations);

        res.status(200).json({
            invitations

        });

    } catch (error) {
        console.error("GET INVITATIONS ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
};