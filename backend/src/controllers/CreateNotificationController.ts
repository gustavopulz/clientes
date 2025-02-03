import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../prisma";

export class CreateNotificationController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { title, message, date, accessLevel } = request.body as any;

        try {
            const notification = await prisma.notification.create({
                data: {
                    title,
                    message,
                    date: new Date(date),
                    accessLevel
                }
            });

            return reply.status(201).send(notification);
        } catch (error) {
            console.error('Error creating notification:', error);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
