const { registerUser } = require('../controllers/userController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Mock dependencies
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('validator');

describe('User Controller - registerUser', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks for each test
    User.findOne.mockReset();
    User.create.mockReset();
    bcrypt.hash.mockReset();
    validator.isEmail.mockReset();

    req = {
      body: {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a new user successfully', async () => {
    User.findOne.mockResolvedValue(null); // Email not taken
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    const mockUserInstance = {
      _id: 'mockUserId',
      fullName: 'Test User',
      email: 'test@example.com',
    };
    User.create.mockResolvedValue(mockUserInstance);
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
    expect(User.create).toHaveBeenCalledWith({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'mockUserId',
      fullName: 'Test User',
      email: 'test@example.com',
    });
  });

  test('should return 400 if email already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' }); // Email taken
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'El correo ya está registrado' });
  });

  test('should return 400 for invalid email format', async () => {
    req.body.email = 'invalid-email';
    validator.isEmail.mockReturnValue(false); // Invalid email

    await registerUser(req, res);
    
    expect(validator.isEmail).toHaveBeenCalledWith('invalid-email');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'El formato del correo electrónico no es válido' });
  });

  test('should return 400 for password too short', async () => {
    req.body.password = 'pass'; // 4 characters - too short
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'La contraseña debe tener al menos 6 caracteres' });
  });

  test('should return 400 for weak password', async () => {
    req.body.password = 'password'; // No uppercase, no numbers
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
    });
  });

  test('should return 400 for fullName too short', async () => {
    req.body.fullName = 'A'; // Solo 1 caracter
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'El nombre debe tener al menos 2 caracteres' 
    });
  });

  test('should return 400 if fullName is missing', async () => {
    req.body.fullName = '';
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todos los campos son obligatorios' });
  });

  test('should return 400 if email is missing', async () => {
    req.body.email = '';
    
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todos los campos son obligatorios' });
  });

  test('should return 400 if password is missing', async () => {
    req.body.password = '';
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todos los campos son obligatorios' });
  });
  
  test('should return 500 if User.create fails', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    validator.isEmail.mockReturnValue(true);
    const dbError = new Error('Database error');
    User.create.mockRejectedValue(dbError);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al registrar usuario',
      error: dbError.message,
    });
  });
});
