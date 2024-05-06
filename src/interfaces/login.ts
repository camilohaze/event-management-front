export interface RequestLogin {
  username: string;
  password: string;
}

export interface ResponseLogin {
  login: boolean;
  role: string;
}