import express from 'express';
import documentRoutes from './routes/documentRoutes';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', documentRoutes);

export default app;
