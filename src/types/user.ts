export interface IUser extends IBase {
  nickname: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  tempAvatar?: string;
}

export interface IBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILogin {
  password: string;
  username: string;
}
