import { Request } from "express";
import { IUserModel } from "../models";

interface IJwtRequest extends Request {
  user: IUserModel;
}

interface IJwtPayloadUser {
  userId: string;
  refresh?: boolean;
}
export type { IJwtPayloadUser, IJwtRequest };
