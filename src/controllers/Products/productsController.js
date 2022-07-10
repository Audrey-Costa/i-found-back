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
    const categories = await db.collection('categories').find().toArray();
    if (!products && !categories) {
      return response.status(404).send('Nenhum produto ou categoria cadastrada.');
    } else if (!products) {
      response.status(404).send('Nenhum produto cadastrado.');
    } else if (!categories) {
      response.status(404).send('Nenhuma categoria cadastrada.');
    }
    const categoriesList = categories.map(category => category.category);
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
    response.status(200).send({ categories: categoriesList, arrProductsToFront });
  } catch {
    closeClient();
    response.status(500).send('Erro ao pegar produtos.');
  }
}

export async function getCategories(request, response) {
  try {
    connectClient();

    const categories = await db.collection('categories').find().toArray();

    if (!categories) return response.status(404).send('Nenhuma categoria cadastrada.');

    let categoriesWithFormated = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i].category;

      categoriesWithFormated.push({
        title: category[0].toUpperCase() + category.substring(1),
        category: category
      });
    }

    closeClient();
    response.status(200).send(categoriesWithFormated);
  } catch {
    closeClient();
    response.status(500).send('Erro ao pegar categorias.');
  }
}

//criar rota que pega por id params e filtra por categorias
