
export interface LoginDto {
    email: string;
    password: string;
}

interface userLoginResponse {
    sub: string;
}

export interface LoginResponseDto {
    user: userLoginResponse;
}

export interface AuthUserDto {
    _id: string,
    name: string,
    age: number,
    documentType: string,
    documentNumber: string,
    email: string,
    phone: string,
    role: string,
    profilePictureUrl: string | null,
    createdAt: string;
    updatedAt: string;
}