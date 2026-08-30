// Matcher backendens User-entitet/DTO'er (gang 06). System.Text.Json serialiserer
// C#-properties (PascalCase) til camelCase i JSON som standard, så felterne herunder er camelCase.

export type Role = 'Deltager' | 'Arrangoer' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string; // ISO 8601-dato-streng fra JSON
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Svaret fra POST /api/auth/login og /api/auth/register.
export interface AuthResponse {
  token: string;
  user: User;
}
