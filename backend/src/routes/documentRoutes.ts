import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { createDocument, getDocuments, getDocument, deleteDocument } from '../controllers/documentController';
import multer from 'fastify-multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

export default async function documentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/documents', { preHandler: upload.single('file') }, createDocument);
    fastify.get('/documents', getDocuments);
    fastify.get('/documents/:id', getDocument);
    fastify.delete('/documents/:id', deleteDocument);

    // Servir arquivos estáticos
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '../../uploads'),
        prefix: '/uploads/',
    });
}
