import prismaClient from "../prisma";

class ListCustomerServices {
    async execute() {
        const customers = await prismaClient.customer.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                create_at: true,
                updated_at: true,
            }
        });

        return customers;
    }
}

export { ListCustomerServices }