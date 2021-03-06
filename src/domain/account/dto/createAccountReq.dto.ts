import { IsNotEmpty, IsString } from "class-validator";

export class CreateAccountReq {
	@IsString()
	@IsNotEmpty()
	password!: string;
}
