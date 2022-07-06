import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

const server = express();

server.use(cors());

server.use(express.json());

server.use(authRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(chalk.cyan('Rodando'));
});
