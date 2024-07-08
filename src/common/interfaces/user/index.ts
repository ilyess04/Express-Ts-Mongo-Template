interface ICreateUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface IEditUser {
  _id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
}

interface IJwtPayloadUser {
  userId: string;
  refresh?: boolean;
}

export type { ICreateUser, IEditUser, IJwtPayloadUser };
