import User from "../models/User";
import validator from "validator";
import Handler from "../utils/handlerTemplate";

class requiredFieldsHandler extends Handler {
  async handle(context, res) {
    const { fullName, email, password } = context;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }
    return await super.handle(context, res); //Siguiente en la cadena
  }
}

class fullNameHandler extends Handler {
  async handle(context, res) {
    const { fullName } = context;

    if (fullName.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "El nombre debe tener al menos 2 caracteres" });
    }
    return await super.handle(context, res); //Siguiente en la cadena
  }
}

class validEmailHandler extends Handler {
  async handle(context, res) {
    const { email } = context;
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "El formato del correo electrónico no es válido" });
    }
    return await super.handle(context, res); //Siguiente en la cadena
  }
}

class passwordLengthHandler extends Handler {
  async handle(context, res) {
    const { password } = context;
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    return await super.handle(context, res); //Siguiente en la cadena
  }
}

class strongPasswordHandler extends Handler {
  async handle(context, res) {
    const { password } = context;
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      });
    }
    return await super.handle(context, res); //Siguiente en la cadena
  }
}

class existingUserHandler extends Handler {
  async handle(context, res) {
    const { email } = context;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    return await super.handle(context, res); //Siguiente en la cadena
  }
}

export {
  requiredFieldsHandler,
  fullNameHandler,
  validEmailHandler,
  passwordLengthHandler,
  strongPasswordHandler,
  existingUserHandler,
};
