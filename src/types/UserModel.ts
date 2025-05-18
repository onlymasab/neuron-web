export type ValidRole = 'admin' | 'user' | 'editor';

export type UserModel = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: {
   role_name: ValidRole
  };
};