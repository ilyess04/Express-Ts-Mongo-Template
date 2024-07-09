import mongoose, { Schema } from "mongoose";
import { COMPANY, USER } from "../../const";
import { ICompanyModel } from "../../interfaces";

const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model<ICompanyModel>(COMPANY, CompanySchema);
export default Company;
