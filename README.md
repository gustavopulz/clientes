# clientes
Project for registering, listing, and removing clients using React, TypeScript, and MongoDB

# Inicialização - Backend:
Instalar as dependencias do prisma no backend: 
- npm install @prisma/client
- npx prisma init

# Em caso de falhas com generate: 
- npx prisma generate

# alterar o código do arquivo schema.prisma para:
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

# Ajustar a linkagem do banco de dados no .env
- Iniciar com: 
# npm run dev 


# Inicialização - Frontend 
- Iniciar com: 
# npm run dev
