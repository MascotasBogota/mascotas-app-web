import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userCreationChain from "../services/userCreationValidation.js";

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const userCreation = userCreationChain();

    // Verificar si las validaciones pasaron
    const validationResult = await userCreation.handle(req.body, res);
    
    // Si la validación falló, ya se envió la respuesta
    if (res.headersSent) {
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Responder con el usuario creado (sin la contraseña)
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error al registrar usuario",
        error: error.message,
      });
    }
  }
};

// 🚨 AÑADIR ESTA FUNCIÓN SI NO EXISTE
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'mascotas_secret_key',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

export { registerUser, loginUser };
