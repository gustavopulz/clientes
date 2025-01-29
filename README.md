# Clientes - BR
Projeto para registrar, listar e remover clientes usando: 
- React, TypeScript, MongoDB, Prisma, Vite e Tailwindcss. 

# Inicialização - Backend:
Instale as dependências do node: 
- npm install

Instalar as dependencias do prisma: 
- npm install @prisma/client
- npx prisma init

# Alterar o código do arquivo schema.prisma para:
    generator client {
        provider = "prisma-client-js"
    }

    datasource db {
        provider = "mongodb"
        url      = env("DATABASE_URL")
    }

    model Customer {
        id         String    @id @default(auto()) @map("_id") @db.ObjectId
        name       String
        email      String
        password   String
        status     Boolean
        create_at  DateTime? @default(now())
        updated_at DateTime? @default(now())

        @@map("customers")
    }


# Em caso de falhas com generate: 
1° Faça a alteração do código do schema.prisma.
2° Execute:
- npx prisma generate

# Banco de dados
Ajuste o link do seu banco de dados no .env

# Rodando backend
Execute:
- npm run dev 


# Inicialização - Frontend 
Instale as dependências com: 
- npm install

# Rode o frontend 
Execute: 
- npm run dev

#

# Clients - EN
Project for registering, listing, and removing clients using:
- React, TypeScript, MongoDB, Prisma, Vite and Tailwindcss. 

# Initialization - Backend:
Install node dependencies: 
- npm install

Install prisma dependencies: 
- npm install @prisma/client
- npx prisma init

# Change the code in the schema.prisma file to:
    generator client {
    provider = "prisma-client-js"
    }

    datasource db {
    provider = "mongodb"
    url      = env("DATABASE_URL")
    }

    model Customer {
    id         String    @id @default(auto()) @map("_id") @db.ObjectId
    name       String
    email      String
    status     Boolean
    create_at  DateTime? @default(now())
    updated_at DateTime? @default(now())

    @@map("customers")
    }

# In case of generate failures: 
1° Make changes to the schema.prisma code.
2° Run:
- npx prisma generate

# Database
Adjust your database link in the .env file

# Running backend
Run:
- npm run dev 


# Initialization - Frontend 
Install dependencies with: 
- npm install

# Run the frontend 
Run: 
- npm run dev
