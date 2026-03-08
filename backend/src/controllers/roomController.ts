import { Request, Response } from "express";
import roomService from "../services/roomService";


interface AuthRequest extends Request {
    userId?: string;
}

class RoomController {
    //create room
    async createRoom(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const { participants, roomName } = req.body;

            if (!Array.isArray(participants)) {
                res.status(400).json({ message: "Participants required" });
                return;
            }
      
            const room = await roomService.createRoom({
                participants: [...participants, req.userId],
                
                roomName
            })
            res.status(201).json(room);


        } catch (error:any) {
            console.log("CREATE ROOM ERROR:", error);
            res.status(400).json({ message: error.message });

        }
    }
    async getUserRooms(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const rooms = await roomService.getUserRooms(req.userId);

        res.status(200).json({
            success: true,
            rooms
        });

    } catch (error: any) {
        console.log("GET USER ROOMS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
}

}
export default new RoomController();