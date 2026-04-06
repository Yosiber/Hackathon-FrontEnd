
export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    documentType: string;
    documentNumber: string;
    phone: string;
    age: number;
    role: string;
}

export interface VerifyUserOtpDto {
    createdUserId: string;
    code: string;
}