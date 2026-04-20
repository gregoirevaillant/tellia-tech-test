import api from "./api";

export const createVoiceNote = (formData: FormData) => {
  const response = api.post("/voice-notes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};
