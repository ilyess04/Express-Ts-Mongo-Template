import { Schema, model } from "mongoose";
import { IUserModel } from "../../interfaces";
import { USER } from "../../const";

const userSchema = new Schema<IUserModel>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUserModel>(USER, userSchema);

export default User;
