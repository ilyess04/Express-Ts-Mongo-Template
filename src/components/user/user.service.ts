import { Model } from "mongoose";
import { ICreateUser, IEditUser, IUserModel } from "../../common/interfaces";
import { User } from "../../common/models";

export class UserService {
  private readonly userModel: Model<IUserModel>;

  constructor() {
    this.userModel = User;
  }

  async getUserByEmail(email: string): Promise<IUserModel | null> {
    return await this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async getUserById(id: string): Promise<IUserModel | null> {
    return await this.userModel
      .findById(id, { isDeleted: false, isArchived: false })
      .exec();
  }

  async updateUser(user: IEditUser): Promise<IUserModel | null> {
    return await this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          ...user
        },
        { new: true }
      )
      .exec();
  }

  async createUser(payload: ICreateUser): Promise<IUserModel> {
    return await new this.userModel(payload).save();
  }
}
