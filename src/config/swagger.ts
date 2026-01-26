import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Notes API',
      version: '1.0.0',
      description: 'API documentation for Smart Notes application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              description: 'User email',
            },
          },
        },
        Note: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Note ID',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-01T12:00:00Z',
            },
            notebook_id: {
              type: 'integer',
              description: 'ID of the notebook this note belongs to',
              example: 1,
            },
            content: {
              type: 'string',
              nullable: true,
              description: 'Note content',
              example: 'This is my first note',
            },
            order_index: {
              type: 'integer',
              nullable: true,
              description: 'Order position of the note',
              example: 0,
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
              example: '2024-01-01T12:00:00Z',
            },
          },
          required: ['id', 'created_at', 'notebook_id'],
        },
        Folder: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Folder ID',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-01T12:00:00Z',
            },
            title: {
              type: 'string',
              description: 'Folder title',
              example: 'Work Projects',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user who owns the folder',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
          required: ['id', 'created_at', 'title', 'user_id'],
        },
        Notebook: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Notebook ID',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-01T12:00:00Z',
            },
            title: {
              type: 'string',
              description: 'Notebook title',
              example: 'My First Notebook',
            },
            description: {
              type: 'string',
              description: 'Notebook description',
              example: 'This is a notebook for personal notes',
            },
            color: {
              type: 'string',
              description: 'Notebook color (hex code or color name)',
              example: '#3B82F6',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-01T12:00:00Z',
            },
            folder_id: {
              type: 'integer',
              description: 'ID of the folder this notebook belongs to',
              example: 1,
            },
            order_index: {
              type: 'integer',
              description: 'Order position of the notebook',
              example: 0,
            },
          },
          required: ['id', 'created_at', 'title', 'description', 'color', 'updated_at', 'folder_id', 'order_index'],
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Profile ID',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-01T12:00:00Z',
            },
            name: {
              type: 'string',
              description: 'User\'s full name',
              example: 'John Doe',
            },
            avatar_url: {
              type: 'string',
              description: 'URL to user\'s avatar image',
              example: 'https://example.com/avatar.jpg',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
              example: '2024-01-01T12:00:00Z',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address (unique)',
              example: 'john.doe@example.com',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated user ID from auth.users',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
          required: ['id', 'created_at', 'name', 'avatar_url', 'email'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ]
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
