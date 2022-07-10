import dayjs from 'dayjs';
import db, { connectClient, closeClient } from '../../databases/mongo.js';

export async function registerProduct(request, response) {
  const { name, category, price, amount, discount } = request.body;
  //testar colocar const
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
      time: dayjs().format('HH:mm:ss')
    });

    response.sendStatus(201);
    closeClient();
  } catch {
    response.status(500).send('Erro ao inserir produto.');
    closeClient();
  }
}
