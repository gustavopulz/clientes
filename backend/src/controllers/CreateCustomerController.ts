import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerServices";

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as { name: string, email: string, password: string };
        const customerService = new CreateCustomerService();

        try {
            const customer = await customerService.execute({ name, email, password });
            reply.send(customer);
        } catch (error) {
            if (error instanceof Error) {
                reply.status(400).send({ message: error.message });
            } else {
                reply.status(400).send({ message: "An unknown error occurred" });
            }
        }
    }
}

export { CreateCustomerController };