import prismaClient from "../prisma";
import bcrypt from 'bcryptjs';

interface CreateCustomerProps {
    name: string;
    email: string;
    password: string;
}

class CreateCustomerService {

    async execute({ name, email, password }: CreateCustomerProps) {

        if (!name || !email || !password) {
            throw new Error("Preencha todos os campos");
        }

        const existingCustomer = await prismaClient.customer.findFirst({
            where: {
                OR: [
                    { name: name },
                    { email: email }
                ]
            }
        });

        if (existingCustomer) {
            if (existingCustomer.name === name) {
                throw new Error("Usuário já existe");
            }
            if (existingCustomer.email === email) {
                throw new Error("Email já cadastrado");
            }
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status: true,
                create_at: new Date(),
                updated_at: new Date()
            }
        });

        return customer;
    }
}

export { CreateCustomerService };