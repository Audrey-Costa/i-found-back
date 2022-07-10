import joi from 'joi';

const registerProductSchema = joi.object({
  category: joi.string().required(),
  name: joi.string().required(),
  amount: joi.string().required(),
  price: joi.string().required(),
  discount: joi.string().required(),
  image: joi.string().required()
});

export default registerProductSchema;
