export interface IUser extends IBase {
  nickname: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
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



// 新增用户信息类型
interface AuthUser {
  userId: string
  // 可扩展其他字段如 roles, permissions 等
}

// 增强 Koa 上下文类型
declare module 'koa' {
  interface Context {
    state: {
      user?: AuthUser
    }
  }
}