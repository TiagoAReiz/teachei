export interface Usuario {
  id: string;
  email: string;
  senhaHash: string | null;
  googleId: string | null;
  aceitouTermos: boolean;
  criadoEm: string;
}
