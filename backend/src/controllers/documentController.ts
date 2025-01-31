import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../prisma';
import path from 'path';
import fs from 'fs';

export const createDocument = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { name, criticidade, dataDisponibilizacao, accessLevel } = req.body as any;
    const file = (req as any).file;

    console.log('Received data:', { name, criticidade, dataDisponibilizacao, accessLevel, file });

    if (!file) {
        reply.status(400).send({ error: 'File is required' });
        return;
    }

    if (file.mimetype !== 'application/pdf') {
        reply.status(400).send({ error: 'Only PDF files are allowed' });
        return;
    }

    const filePath = path.join(__dirname, '../../uploads', file.originalname);

    try {
        const document = await prisma.document.create({
            data: {
                name,
                criticidade,
                dataDisponibilizacao: new Date(dataDisponibilizacao),
                fileUrl: filePath,
                accessLevel,
                status: 'Pendente'
            },
        });
        fs.renameSync(file.path, filePath); // Renomeie o arquivo para o nome original
        reply.status(201).send(document);
    } catch (error) {
        console.error('Error creating document:', error);
        reply.status(500).send({ error: 'Error creating document' });
    }
};

export const getDocuments = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const documents = await prisma.document.findMany();
        reply.status(200).send(documents);
    } catch (error) {
        reply.status(500).send({ error: 'Error fetching documents' });
    }
};

export const getDocument = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = req.params as any;
    try {
        const document = await prisma.document.findUnique({ where: { id } });
        if (!document) {
            reply.status(404).send({ error: 'Document not found' });
            return;
        }
        reply.status(200).send(document);
    } catch (error) {
        reply.status(500).send({ error: 'Error fetching document' });
    }
};

export const deleteDocument = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = req.params as any;
    try {
        const document = await prisma.document.delete({ where: { id } });
        fs.unlinkSync(document.fileUrl); // Remove the file from the server
        reply.status(200).send({ message: 'Document deleted successfully' });
    } catch (error) {
        reply.status(500).send({ error: 'Error deleting document' });
    }
};
