import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	userId!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;

	@IsString()
	@IsNotEmpty()
	userName!: string;
}