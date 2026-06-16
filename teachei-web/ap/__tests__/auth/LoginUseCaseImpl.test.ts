import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUseCaseImpl } from "@/ap/auth/application/usecase/LoginUseCaseImpl";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";

process.env.JWT_SECRET = "test-secret-that-is-32-chars-long!!";

const mockRepo: UsuarioRepositoryPort = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findByGoogleId: vi.fn(),
  save: vi.fn(),
  updateSenha: vi.fn(),
  delete: vi.fn(),
  linkGoogleId: vi.fn(),
};

describe("LoginUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lança CredenciaisInvalidasException se usuário não existe", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue(null);
    const useCase = new LoginUseCaseImpl(mockRepo);
    await expect(useCase.execute("x@x.com", "senha")).rejects.toThrow("Email ou senha inválidos");
  });

  it("lança CredenciaisInvalidasException se senha errada", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue({
      id: "1", email: "a@b.com", senhaHash: "hash-errado",
      googleId: null, aceitouTermos: true, criadoEm: new Date().toISOString(),
    });
    const useCase = new LoginUseCaseImpl(mockRepo);
    await expect(useCase.execute("a@b.com", "senha-errada")).rejects.toThrow("Email ou senha inválidos");
  });
});
