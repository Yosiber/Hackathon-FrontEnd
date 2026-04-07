
export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    user: UserLoginResponse;
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

export interface UserLoginResponse {
    sub: string;
}