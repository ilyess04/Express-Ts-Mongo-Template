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

export type { ICreateUser, IEditUser };
