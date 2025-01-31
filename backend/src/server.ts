import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { routes } from "./routes";

const app = Fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: error.message });
});

const start = async () => {
    await app.register(cors);
    await app.register(multipart); // Adicione o suporte a multipart
    await app.register(routes);

    try {
        await app.listen({ port: 8080 });
        console.log('Server is running on http://localhost:8080');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();