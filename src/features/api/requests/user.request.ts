import axiosInstance from "../axios.instance";
import type { CreateUserDto, VerifyUserOtpDto, UpdateUserDto, RequestEmailChangeDto } from "../types/user.types";

// Create User
export const createUser = async (createUser: CreateUserDto) => axiosInstance.post("/users", createUser);

// Verify User
export const verifyUser = async (verifyUser: VerifyUserOtpDto) => axiosInstance.post(`/users/${verifyUser.createdUserId}/verify-registration`, verifyUser);

// Re-send Register Code
export const resendRegisterCode = async (userId: string) => axiosInstance.post(`/users/${userId}/resend-registration-code`);

// Update User info parameter (name, age, phone, etc.)
export const updateByParameter = async (userId: string, partialData: UpdateUserDto) => axiosInstance.patch(`/users/${userId}`, partialData);

// Request Email Change
export const requestEmailChange = async (userId: string, data: RequestEmailChangeDto) => axiosInstance.post(`/users/${userId}/request-email-change`, data);

// Verify Email Change
export const verifyEmailChange = async (userId: string, data: { code: string }) => axiosInstance.post(`/users/${userId}/verify-email-change`, data);

// Update Profile Picture
export const updateProfilePicture = async (userId: string, imageBase64: string) => {
  const formData = new FormData();
  
  // Convertir base64 a Blob
  const byteCharacters = atob(imageBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  
  // Agregar el archivo al FormData con el nombre que espera NestJS
  formData.append('profilePicture', blob, 'profile-picture.png');
  
  return axiosInstance.post(`/users/${userId}/profile-picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};