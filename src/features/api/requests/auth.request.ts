import type { AxiosResponse } from "axios";
import axiosInstance from "../axios.instance";
import type { AuthUserDto, LoginDto, LoginResponseDto } from "../types/auth.type";

// Login
export const loginRequest = async (login: LoginDto): Promise<LoginResponseDto> => (await axiosInstance.post("/auth/login", login)).data;

// Get Authenticated User Profile
export const getAuthUserProfile = async (userId: string): Promise<AuthUserDto> => (await axiosInstance.get(`/users/${userId}`)).data;

// Refresh token Payload
export  const verifyToken = async (): Promise<AxiosResponse> => (await axiosInstance.get("/auth/refresh"));

// Logout
export const logout = async (): Promise<boolean> => (await axiosInstance.get("/auth/logout"));