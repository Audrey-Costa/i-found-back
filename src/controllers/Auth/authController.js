import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
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
      password: passwordCrypted,
      favoriteds: []
    });

    response.status(201).send('Usuário adicionado');

    closeClient();
  } catch {
    //
    response.status(500).send('Erro ao adicionar no banco');
    closeClient();
  }
}

export async function loginUser(request, response) {
  const { email, password } = request.body;

  try {
    connectClient();
    const user = await db.collection('users').findOne({ email });
    const { user_Id } = user;

    const decrypted = bcrypt.compare(password, user.password);

    if (!user || !decrypted) {
      closeClient();
      return response.status(401).send('Email ou Senha incorretos(s)!');
    }

    const token = uuid();

    await db.collection('sessions').insertOne({
      token,
      user_Id
    });

    response.status(200).send({
      headers: {
        Authorization: 'Bearer ' + token
      },
      user: {
        user_Id,
        name: user.name
      }
    });
    closeClient();
  } catch {
    response.status(500).send('Erro ao realizar login');
    closeClient();
  }
}

export async function checkoutUser(request, response) {
  try {
    connectClient();
    const session = response.locals.session;

    await db.collection('sessions').deleteOne({ user_Id: session.user_Id });
    response.sendStatus(200);

    closeClient();
  } catch {
    closeClient();
    response.status(500).send('Erro ao fazer checkout');
  }
}
