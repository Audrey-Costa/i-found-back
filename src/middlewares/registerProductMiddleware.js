import registerProductSchema from '../schemas/registerProductSchema.js';

async function validateRegisterProduct(request, response, next) {
  const newProduct = request.body;
  const validate = registerProductSchema.validate(newProduct, { abortEarly: false });
  const { error } = validate;

  if (error) {
    const errors = error.details.map(error => error.message);
    return response.status(422).send(errors);
  }

  next();
}

export default validateRegisterProduct;
