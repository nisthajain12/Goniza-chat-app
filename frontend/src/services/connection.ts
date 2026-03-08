import { api } from "./authService";

type Payload = {
  receiverId: string;
  message: string;
};

type Status ={
  status: string
}

// creating connection
export const createConnection = async (formData: Payload) => {
  const response = await api.post(
    "/connection/createConnection",
    formData
  );
  return response.data;
};

// fetching invitations
export const getInvitationApi = async () => {
  const response = await api.get(
    "/connection/getInvitations"
  );
  return response.data;
};

export const respondToInvitation = async (
  connectionId: string,
  status: "accepted" | "rejected"
) => {
  const response = await api.patch(
    `/connection/respondToInvitation/${connectionId}`,
    { status }
  );

  return response.data;
};

export const getAcceptedConnectionsApi = async () => {
  const response = await api.get("/connection/accepted");
  return response.data;
};