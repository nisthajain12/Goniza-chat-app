import { api } from "./authService"
type payload = {
    receiverId: string, status: string, message: string
}

// create
export const createConnection = async (formData: payload, token: string) => {
    const response = await api.post("/connection/createConnection", formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

//GET API
export const getInvitationApi= async(token :string)=>{
    const response=await api.get("/connection/getInvitations",{
        headers: {
            Authorization: `Bearer ${token}`
        }

    });
    return response.data;
}