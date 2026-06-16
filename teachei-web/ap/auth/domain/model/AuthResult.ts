export interface AuthResult {
  token: string;
  usuarioId: string;
  email: string;
  expiresIn: number;
  tokenType: "Bearer";
}
