export interface User {
}

export interface UpdateUser {
    path: string;
    op: 'replace';
    value: any;
  }
