import { Schema, model } from "mongoose";
import { IUserModel } from "../../interfaces";

const userSchema = new Schema<IUserModel>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUserModel>("User", userSchema);

export default User;
