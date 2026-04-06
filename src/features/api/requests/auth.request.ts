import axiosInstance from "../axios.instance";
import type { AuthUserDto, LoginDto, LoginResponseDto } from "../types/auth.type";

// Login
export const loginRequest = async (login: LoginDto): Promise<LoginResponseDto> => axiosInstance.post("/auth/login", login);

// Get Authenticated User Profile
export const getAuthUserProfile = async (userId: string): Promise<AuthUserDto> => axiosInstance.get(`/users/${userId}`);
