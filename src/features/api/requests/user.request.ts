import axiosInstance from "../axios.instance";
import type { CreateUserDto } from "../types/user.types";

// Create User
export const createUer = async (createUser: CreateUserDto) => axiosInstance.post("/users", createUser);

