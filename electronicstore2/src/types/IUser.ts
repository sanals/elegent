export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  createdAt: Date;
} 