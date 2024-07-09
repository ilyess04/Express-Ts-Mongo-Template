import { Request, Response } from "express";
import { CompanyService } from "./company.service";
import { IJwtRequest } from "../../common/interfaces";

export class CompanyController {
  private readonly companyService: CompanyService;
  constructor() {
    this.companyService = new CompanyService();
  }

  async createCompany(req: IJwtRequest | any, res: Response) {
    try {
      const { name } = req.body;
      const { _id } = (req as any).user;
      const company = await this.companyService.createCompany({
        name,
        manager: _id,
      });
      return res.status(201).json({
        message: "Company created successfully!",
        company,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
