import userRegisterSchema from '../schemas/userRegisterSchema.js';

// valida o login
async function validateUserRegister(request, response, next) {
  const userRegister = request.body;
  const validate = userRegisterSchema.validate(userRegister, { abortEarly: false });
  const { error } = validate;

  if (error) {
    const errors = error.details.map(error => error.message);
    response.status(422).send(errors);
    return;
  }
  next();
}

export default validateUserRegister;
