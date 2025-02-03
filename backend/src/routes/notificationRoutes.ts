import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateNotificationController } from "../controllers/CreateNotificationController";
import { ListNotificationsController } from "../controllers/ListNotificationsController";

export default async function notificationRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post("/notifications", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateNotificationController().handle(request, reply);
    });

    fastify.get("/notifications", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListNotificationsController().handle(request, reply);
    });
}