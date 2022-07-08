import userLoginSchema from '../schemas/userLoginSchema.js';

async function validateUserLogin(request, response, next) {
  const userLogin = request.body;
  const validate = userLoginSchema.validate(userLogin, { abortEarly: false });
  const { error } = validate;

  if (error) {
    const errors = error.details.map(error => error.message);

    return response.status(422).send(errors);
  }

  next();
}

export default validateUserLogin;
