const jwt = require("jsonwebtoken");
const authMiddleware = require("../src/middleware/auth");
const request = require("supertest");

jest.mock("../src/config/database", () => ({
  pool: {
    query: jest.fn(),
  },
  initDatabase: jest.fn().mockResolvedValue(undefined),
}));

const { pool } = require("../src/config/database");

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

describe("API integration-like tests", () => {
  let app;

  beforeAll(() => {
    process.env.NODE_ENV = "test";
    app = require("../src/app");
  });

  beforeEach(() => {
    pool.query.mockReset();
    jwt.verify.mockReset();
    jwt.sign.mockReset();
    jwt.sign.mockReturnValue("test-token");
  });

  test("POST /api/auth/register returns 201 and token", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1, email: "demo@example.com", name: "Demo" }],
    });

    const response = await request(app).post("/api/auth/register").send({
      email: "demo@example.com",
      password: "123456",
      name: "Demo",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe("demo@example.com");
  });

  test("POST /api/tasks creates a task for authenticated user", async () => {
    jwt.verify.mockReturnValue({ id: 1, email: "demo@example.com" });
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 10,
          user_id: 1,
          title: "Ship changes",
          description: "Smoke test deployment",
          completed: false,
        },
      ],
    });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", "Bearer valid-token")
      .send({
        title: "Ship changes",
        description: "Smoke test deployment",
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Ship changes");
    expect(pool.query).toHaveBeenCalled();
  });
});
