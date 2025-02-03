import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../prisma";

export class ListNotificationsController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        try {
            const notifications = await prisma.notification.findMany();
            return reply.status(200).send(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
