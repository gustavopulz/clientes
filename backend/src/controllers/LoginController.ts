import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prisma";
import bcrypt from 'bcryptjs';

export class LoginController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as { email: string, password: string };

        const customer = await prismaClient.customer.findFirst({
            where: { email },
            select: { email: true, id: true, name: true, status: true, role: true, create_at: true, updated_at: true, password: true }
        });

        if (!customer) {
            return reply.status(401).send({ error: "Customer" });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);

        if (!isPasswordValid) {
            return reply.status(401).send({ error: "Password" });
        }

        return reply.send({ token: "fake-jwt-token", role: customer.role });
    }
}