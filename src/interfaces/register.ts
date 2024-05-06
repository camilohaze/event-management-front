export interface RequestRegister {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ResponseRegister {
  register: boolean;
}
