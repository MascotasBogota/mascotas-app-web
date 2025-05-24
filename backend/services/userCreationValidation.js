import {
  requiredFieldsHandler,
  fullNameHandler,
  validEmailHandler,
  passwordLengthHandler,
  strongPasswordHandler,
  existingUserHandler,
} from "../handlers/userCreationHandler";

export const userCreationChain = () => {
  const requiredFields = new requiredFieldsHandler();
  const fullNameLength = new fullNameHandler();
  const emailFormat = new validEmailHandler();
  const passwordLength = new passwordLengthHandler();
  const passwordStrength = new strongPasswordHandler();
  const existingUser = new existingUserHandler();

  //Creación de la cadena
  requiredFields
    .setNext(fullNameLength)
    .setNext(emailFormat)
    .setNext(passwordLength)
    .setNext(passwordStrength)
    .setNext(existingUser);

  return requiredFields;
};
