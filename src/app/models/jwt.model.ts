export interface DeCodedJWT {
  sub: string;
  user_name: string;
  email: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
