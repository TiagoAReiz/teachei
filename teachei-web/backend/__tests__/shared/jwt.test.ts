import { describe, it, expect } from "vitest";

// Mock env before importing module
process.env.JWT_SECRET = "test-secret-that-is-32-chars-long!!";

const { signToken, verifyToken } = await import("@/backend/shared/middleware/jwt");

describe("jwt", () => {
  it("sign e verify retornam o mesmo payload", async () => {
    const token = await signToken({ sub: "user-123", email: "a@b.com" });
    const payload = await verifyToken(token);
    expect(payload.sub).toBe("user-123");
    expect(payload.email).toBe("a@b.com");
  });

  it("token inválido lança erro", async () => {
    await expect(verifyToken("token-invalido")).rejects.toThrow();
  });
});
