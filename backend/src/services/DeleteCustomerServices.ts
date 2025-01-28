import prismaClient from "../prisma";

interface DeleteCustumerProps {
    id: string;
}

class DeleteCustomerService {
    async execute({ id }: DeleteCustumerProps) {
        if (!id) {
            throw new Error("Solicitação inválida")
        }

        const findCustomer = await prismaClient.customer.findFirst({
            where: {
                id: id
            }
        })

        if (!findCustomer) {
            throw new Error("Cliente não encontrado")
        }

        await prismaClient.customer.delete({
            where: {
                id: findCustomer.id
            }
        })
        return { message: "Deletado com sucesso" }
    }
}

export { DeleteCustomerService }