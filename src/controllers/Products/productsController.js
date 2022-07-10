import dayjs from 'dayjs';
import db, { connectClient, closeClient } from '../../databases/mongo.js';

export async function registerProduct(request, response) {
  const { name, category, price, amount, discount, image } = request.body;

  const session = response.locals.session;

  try {
    connectClient();

    await db.collection('products').insertOne({
      user_Id: session.user_Id,
      name,
      category,
      price: Number(price),
      amount: Number(amount),
      discount: Number(discount),
      image,
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

    let categoriesWithTitle = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i].category;

      categoriesWithTitle.push({
        title: category[0].toUpperCase() + category.substring(1),
        category: category
      });
    }
    //======================================================================
    let productsList = [];
    for (let i = 0; i < products.length; i++) {
      const numberWithDiscount = (
        products[i].price -
        products[i].price * (products[i].discount * 0.01)
      ).toFixed(2);

      productsList.push({
        name: products[i].name,
        category: products[i].category,
        price: products[i].price,
        discount: products[i].discount,
        amount: products[i].amount,
        priceWithDiscount: numberWithDiscount
      });
    }
    closeClient();
    response.status(200).send({ categoriesWithTitle, productsList });
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

    let categoriesWithTitle = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i].category;

      categoriesWithTitle.push({
        title: category[0].toUpperCase() + category.substring(1),
        category: category
      });
    }

    closeClient();
    response.status(200).send(categoriesWithTitle);
  } catch {
    closeClient();
    response.status(500).send('Erro ao pegar categorias.');
  }
}

export async function getProductsForCategory(request, response) {
  const { category } = request.params;
  try {
    connectClient();

    const productsList = await db.collection('products').find({ category }).toArray();

    const productsNameList = productsList.map(product => product.name);

    closeClient();
    response.status(200).send(productsNameList);
  } catch {
    closeClient();
    response.status(500).send('Erro ao pegar produtos.');
  }
}

//criar rota que pega por id params e filtra por categorias
