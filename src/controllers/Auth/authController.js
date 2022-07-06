import bcrypt from 'bcrypt';
import db, { connectClient, closeClient } from '../../databases/mongo.js';

export async function createUser(request, response) {
  const { email, password, name } = request.body;

  try {
    connectClient();

    const isRegistered = await db.collection('users').findOne({ email });

    if (isRegistered) {
      response.status(409).send('Usuário ja cadastrado!');
      closeClient();
      return;
    }
    //===
    const users = await db.collection('users').find().toArray();

    const passwordCrypted = bcrypt.hashSync(password, 10);

    await db.collection('users').insertOne({
      user_Id: users.length,
      name,
      email,
      password: passwordCrypted
    });

    response.status(201).send('Usuário adicionado');

    closeClient();
  } catch {
    response.status(500).send('Erro ao adicionar no banco');
    closeClient();
  }
}
