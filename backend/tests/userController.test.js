// userController.test.js
// Este archivo es un ES Module (gracias a "type": "module" en package.json)

// Importa tus dependencias directamente.
// Vitest maneja la interop CJS/ESM de forma nativa.
import { registerUser, loginUser } from "../controllers/userController.js";
import User from "../models/User.js"; // Asumiendo exportación default
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

// --- Mocks de Vitest ---
// Con Vitest, declaras el mock usando vi.mock() al nivel superior.
// Luego, para las funciones individuales, puedes acceder a ellas directamente
// o usar vi.fn() si necesitas control sobre su implementación.

// vi.mock() es nativo y maneja la interop CJS/ESM muy bien.
// El segundo argumento es una "factory" que devuelve el módulo mockeado.
// Para CommonJS (como bcryptjs y validator), su module.exports se convierte en la exportación 'default'.
vi.mock("../models/User", () => ({
  default: {
    // Asumiendo que User es una exportación default
    findOne: vi.fn(),
    create: vi.fn(),
    // Añade cualquier otro método de User que uses y necesites mockear
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    // bcryptjs es CommonJS, su exports se vuelve 'default'
    hash: vi.fn(),
    compare: vi.fn(),
    // Añade otros métodos de bcrypt si los usas
  },
}));

vi.mock("validator", () => ({
  default: {
    // validator es CommonJS, su exports se vuelve 'default'
    isEmail: vi.fn(),
    // Añade otros métodos de validator si los usas
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    // jwt es CommonJS, su exports se vuelve 'default'
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

describe("User Controller - registerUser", () => {
  let req;
  let res;

  beforeEach(() => {
    // Vitest: vi.mock ya ha mockeado los módulos.
    // Accede a las funciones mockeadas directamente en el módulo importado.    // Asegúrate de que tus mocks iniciales en vi.mock() hayan definido estas funciones.
    User.findOne.mockReset();
    User.create.mockReset();
    bcrypt.hash.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
    validator.isEmail.mockReset();

    req = {
      body: {
        fullName: "Test User",
        email: "test@example.com",
        password: "Password123",
      },
    };
    res = {
      status: vi.fn().mockReturnThis(), // vi.fn() en lugar de jest.fn()
      json: vi.fn(), // vi.fn() en lugar de jest.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks(); // vi.clearAllMocks() en lugar de jest.clearAllMocks()
  });

  test("should register a new user successfully", async () => {
    User.findOne.mockResolvedValue(null); // Email not taken
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    const mockUserInstance = {
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
    };
    User.create.mockResolvedValue(mockUserInstance);
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("Password123", 10);
    expect(User.create).toHaveBeenCalledWith({
      fullName: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
    });
  });

  test("should return 400 if email already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" }); // Email taken
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El correo ya está registrado",
    });
  });

  test("should return 400 for invalid email format", async () => {
    req.body.email = "invalid-email";
    validator.isEmail.mockReturnValue(false); // Invalid email

    await registerUser(req, res);

    expect(validator.isEmail).toHaveBeenCalledWith("invalid-email");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El formato del correo electrónico no es válido",
    });
  });

  test("should return 400 for password too short", async () => {
    req.body.password = "pass"; // 4 characters - too short
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  });

  test("should return 400 for weak password", async () => {
    req.body.password = "password"; // No uppercase, no numbers
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
    });
  });

  test("should return 400 for fullName too short", async () => {
    req.body.fullName = "A"; // Solo 1 caracter
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El nombre debe tener al menos 2 caracteres",
    });
  });

  test("should return 400 if fullName is missing", async () => {
    req.body.fullName = "";
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
  });

  test("should return 400 if email is missing", async () => {
    req.body.email = "";

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
  });

  test("should return 400 if password is missing", async () => {
    req.body.password = "";
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
  });

  test("should return 500 if User.create fails", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    validator.isEmail.mockReturnValue(true);
    const dbError = new Error("Database error");
    User.create.mockRejectedValue(dbError);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al registrar usuario",
      error: dbError.message,
    });
  });
});

describe("User Controller - loginUser", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    User.findOne.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();

    req = {
      body: {
        email: "test@example.com",
        password: "Password123",
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should login user successfully with valid credentials", async () => {
    const mockUser = {
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    };
    const mockToken = "mockJwtToken123";

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("Password123", "hashedPassword123");
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "mockUserId" },
      expect.any(String),
      { expiresIn: "30d" }
    );
    expect(res.json).toHaveBeenCalledWith({
      token: mockToken,
      user: {
        _id: "mockUserId",
        fullName: "Test User",
        email: "test@example.com",
      },
    });
  });

  test("should return 400 if email is missing", async () => {
    req.body.email = "";

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("should return 400 if password is missing", async () => {
    req.body.password = "";

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("should return 400 if both email and password are missing", async () => {
    req.body = {};

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("should return 400 if user does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Credenciales inválidas",
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("should return 400 if password is incorrect", async () => {
    const mockUser = {
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); // Password doesn't match

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("Password123", "hashedPassword123");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Credenciales inválidas",
    });
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test("should return 500 if User.findOne fails", async () => {
    const dbError = new Error("Database connection error");
    User.findOne.mockRejectedValue(dbError);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al iniciar sesión",
      error: dbError.message,
    });
  });

  test("should return 500 if bcrypt.compare fails", async () => {
    const mockUser = {
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    };
    const bcryptError = new Error("Bcrypt comparison error");

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockRejectedValue(bcryptError);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al iniciar sesión",
      error: bcryptError.message,
    });
  });

  test("should return 500 if jwt.sign fails", async () => {
    const mockUser = {
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    };
    const jwtError = new Error("JWT signing error");

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation(() => {
      throw jwtError;
    });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al iniciar sesión",
      error: jwtError.message,
    });
  });

  test("should use default JWT secret if process.env.JWT_SECRET is not set", async () => {
    const mockUser = {
      _id: "mockUserId",
      fullName: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    };
    const mockToken = "mockJwtToken123";

    // Temporarily remove JWT_SECRET from process.env
    const originalJwtSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    await loginUser(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "mockUserId" },
      "mascotas_secret_key", // Default secret
      { expiresIn: "30d" }
    );

    // Restore original JWT_SECRET
    if (originalJwtSecret) {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  });
});
