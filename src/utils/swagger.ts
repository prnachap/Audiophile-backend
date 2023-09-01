import { type Application, type Request, type Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Audiophile API',
      description: 'REST API for Audiophile App',
      version,
    },
    components: {
      securitySchemas: {
        googleAuth: {
          type: 'apiKey',
          name: 'Cookie',
          in: 'cookie',
        },
        LocalAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
    security: [{ googleAuth: [], LocalAuth: [] }],
  },
  // looks for configuration in specified directories
  apis: ['./src/routes/*.ts', './src/schema/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app: Application, port: number) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
