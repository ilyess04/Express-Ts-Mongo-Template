import { Model } from "mongoose";
import { ICompanyModel, ICreateCompany } from "../../common/interfaces";
import { Company } from "../../common/models";

export class CompanyService {
  private readonly companyModel: Model<ICompanyModel>;
  constructor() {
    this.companyModel = Company;
  }

  async createCompany(payload: ICreateCompany): Promise<ICompanyModel | null> {
    return await new this.companyModel(payload).save();
  }
}
