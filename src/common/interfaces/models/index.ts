import { Document } from "mongoose";

interface IUserModel extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
export type { IUserModel };
