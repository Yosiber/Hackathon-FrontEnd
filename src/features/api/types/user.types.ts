export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    documentType: string;
    documentNumber: string;
    phone: number;
    age: number;
    role: string;
}

export interface UpdateUserDto {
    name?: string;
    age?: number;
    phone?: number;
    // We omit email and password here due to backend logic
}

export interface RequestEmailChangeDto {
    newEmail: string;
}

export interface VerifyUserOtpDto {
    createdUserId: string;
    code: string;
}