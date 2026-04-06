import axiosInstance from "../axios.instance";
import type { CreateUserDto, VerifyUserOtpDto } from "../types/user.types";

// Create User
export const createUser = async (createUser: CreateUserDto) => axiosInstance.post("/users", createUser);

// Verify User
export const verifyUser = async (verifyUser: VerifyUserOtpDto) => axiosInstance.post(`/users/${verifyUser.createdUserId}/verify-registration`, verifyUser);

