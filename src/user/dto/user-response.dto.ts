import { Expose } from "class-transformer";

export class UserResponseDto{
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    phoneNumber: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}