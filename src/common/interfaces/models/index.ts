import mongoose, { Document } from "mongoose";

interface IUserModel extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
interface ICompanyModel extends Document {
  name: string;
  manager: mongoose.Types.ObjectId;
}
export type { IUserModel, ICompanyModel };
