const jwt = require("jsonwebtoken");
const authMiddleware = require("../src/middleware/auth");

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("returns 401 when no token is provided", () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when token is invalid", () => {
    req.headers.authorization = "Bearer bad-token";
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when token is valid", () => {
    req.headers.authorization = "Bearer valid-token";
    jwt.verify.mockReturnValue({ id: 1, email: "test@example.com" });

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: 1, email: "test@example.com" });
    expect(next).toHaveBeenCalled();
  });
});
