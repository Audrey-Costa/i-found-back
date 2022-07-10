import dayjs from 'dayjs';
import db, { connectClient, closeClient } from '../../databases/mongo.js';

export async function registerProduct(request, response) {
  const { name, category, price, amount, discount } = request.body;

  const session = response.locals.session;

  try {
    connectClient();

    const categoryRegistered = await db.collection('categories').findOne({ category });
    if (!categoryRegistered) {
      await db.collection('categories').insertOne({ category });
    }

    await db.collection('products').insertOne({
      user_Id: session.user_Id,
      name,
      category,
      price: Number(price),
      amount: Number(amount),
      discount: Number(discount),
      time: dayjs().format('HH:mm:ss')
    });

    response.sendStatus(201);
    closeClient();
  } catch {
    response.status(500).send('Erro ao inserir produto.');
    closeClient();
  }
}

export async function getProducts(request, response) {
  try {
    connectClient();

    const products = await db.collection('products').find().toArray();

    let arrProductsToFront = [];

    for (let i = 0; i < products.length; i++) {
      const numberWithDiscount = (
        products[i].price -
        products[i].price * (products[i].discount * 0.01)
      ).toFixed(2);

      arrProductsToFront.push({
        name: products[i].name,
        category: products[i].category,
        price: products[i].price,
        discount: products[i].discount,
        amount: products[i].amount,
        priceWithDiscount: numberWithDiscount
      });
    }
    closeClient();
    response.status(200).send(arrProductsToFront);
  } catch {
    closeClient();
    response.status(500).send('Erro ao pegar produtos.');
  }
}

//criar rota que pega por id params e filtra por categorias
