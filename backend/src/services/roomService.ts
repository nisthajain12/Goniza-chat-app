import Room from "../models/Room";
import mongoose from "mongoose";

//type and interface name start from capital letter 
type RoomType= "personal"| "group";
interface CreateRoomParams{
    participants:string[];
    roomName?:string;
    //? this indictes if we dont send roomname it wont break
}
 
class RoomService{
    async createRoom(params:CreateRoomParams){
        const { participants, roomName}= params;

        let finalParticipants= [...new Set(participants)];
        if(finalParticipants.length<2){
            throw new Error ("Invalid participants count"); 
        }
        let roomType:RoomType;

        if(finalParticipants.length===2){
            roomType="personal";

            const sortedParticipants=[...finalParticipants].sort();
            const existingRoom= await Room.findOne({
                roomType: "personal",
                participants: {$all:sortedParticipants}
            });
            if(existingRoom){
                return existingRoom;
            }
            finalParticipants=sortedParticipants;

        }
        else{
            roomType="group";
            if(!roomName?.trim()){
                throw new Error ("Room name required for group chat");
            }
        }
        const newRoom= await Room.create({
            participants: finalParticipants,
            roomType,
            roomName: roomType==="group"? roomName: ""
        });
        return newRoom;
    }

    async getUserRooms(userId: string) {

  const objectUserId = new mongoose.Types.ObjectId(userId);

  const rooms = await Room.aggregate([

    // Only rooms where user is participant
    {
      $match: {
        participants: objectUserId
      }
    },

    // Extract "otherParticipant" ONLY for personal rooms
    {
      $addFields: {
        otherParticipant: {
          $cond: [
            { $eq: ["$roomType", "personal"] },

            {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$participants",
                    as: "participant",
                    cond: {
                      $ne: ["$$participant", objectUserId]
                    }
                  }
                },
                0
              ]
            },

            null
          ]
        }
      }
    },

    //Join with Profile collection
    {
      $lookup: {
        from: "profiles",           // collection name
        localField: "otherParticipant",
        foreignField: "user",
        as: "otherProfile"
      }
    },

    // Create displayName field
    {
      $addFields: {
        displayName: {
          $cond: [
            { $eq: ["$roomType", "personal"] },
            { $arrayElemAt: ["$otherProfile.name", 0] },
            "$roomName"
          ]
        }
      }
    },

    //  Clean unwanted fields
    {
      $project: {
        otherProfile: 0,
        otherParticipant: 0
      }
    },

    // Sort latest first
    {
      $sort: { updatedAt: -1 }
    }

  ]);

  return rooms;
}

}
export default new RoomService();