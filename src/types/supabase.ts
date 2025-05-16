import { Database as GeneratedDatabase } from './database.types';

export type Database = GeneratedDatabase;

export type ValidRole = 'admin' | 'user' | 'editor';

export type UserModel = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: ValidRole;
};