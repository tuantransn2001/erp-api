export interface LoginDTO {
  phone: string;
  password: string;
}

export interface TokenDTO {
  id: string;
  user_name: string;
}

export interface MeDTO {
  currentUserID: string;
}
