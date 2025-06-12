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
  op: 'replace';
  path: string;
  value: any;
}

export interface EmailRequest {
  email: string;
  clientAppUrl: string;
}
