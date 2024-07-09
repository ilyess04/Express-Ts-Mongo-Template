import { Request, Response } from "express";
import { CompanyService } from "./company.service";

export class CompanyController {
  private readonly companyService: CompanyService;
  constructor() {
    this.companyService = new CompanyService();
  }

  async createCompany(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const company = await this.companyService.createCompany({
        name,
        manager: "",
      });
      return res.status(200).json({
        message: "Company created successfully!",
        company,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
