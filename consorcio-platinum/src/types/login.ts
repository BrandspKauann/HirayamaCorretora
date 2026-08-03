export interface Login {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginInsert {
  email: string;
  password_hash: string;
  role?: string;
  active?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

