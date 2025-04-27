export interface User {
  userId: string;
  email: string;
  userName: string;
  imageUrl: string;
}

export interface CreateUser {
  email: string;
  userName: string;
  password: string;
}

export interface UpdateUser {
    path: string;
    op: 'replace';
    value: any;
  }
