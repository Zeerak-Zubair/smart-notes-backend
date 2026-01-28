import { Router } from 'express';
import {
  getAllNotebooks,
  getNotebookById,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  getAllNotebooksCount
} from '../controllers/notebooksController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

/**
 * @swagger
 * /api/notebooks:
 *   get:
 *     summary: Get all notebooks (optionally filtered by folder)
 *     tags: [Notebooks]
 *     parameters: []
 *     description: Get all notebooks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notebooks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notebooks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notebook'
 *                 count:
 *                   type: integer
 *                   description: Total number of notebooks
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllNotebooks);

/**
 *
 */
router.get('/count', getAllNotebooksCount);

/**
 * @swagger
 * /api/notebooks/get:
 *   post:
 *     summary: Get a notebook by ID
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notebook_id
 *             properties:
 *               notebook_id:
 *                 type: string
 *                 format: uuid
 *                 description: The notebook ID
 *     responses:
 *       200:
 *         description: Notebook details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notebook'
 *       404:
 *         description: Notebook not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/get', getNotebookById);

/**
 * @swagger
 * /api/notebooks:
 *   post:
 *     summary: Create a new notebook
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - color
 *               - order_index
 *             properties:
 *               title:
 *                 type: string
 *                 description: Notebook title
 *                 example: My First Notebook
 *               description:
 *                 type: string
 *                 description: Notebook description
 *                 example: This is a notebook for personal notes
 *               color:
 *                 type: string
 *                 description: Notebook color (hex code or color name)
 *                 example: "#3B82F6"
 *               order_index:
 *                 type: integer
 *                 description: Order position of the notebook
 *                 example: 0
 *     responses:
 *       201:
 *         description: Notebook created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notebook created successfully
 *                 notebook:
 *                   $ref: '#/components/schemas/Notebook'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createNotebook);

/**
 * @swagger
 * /api/notebooks:
 *   put:
 *     summary: Update a notebook
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notebook_id
 *             properties:
 *               notebook_id:
 *                 type: string
 *                 format: uuid
 *                 description: The notebook ID
 *               title:
 *                 type: string
 *                 description: Updated notebook title
 *                 example: Updated Notebook
 *               description:
 *                 type: string
 *                 description: Updated notebook description
 *                 example: Updated description
 *               color:
 *                 type: string
 *                 description: Updated notebook color
 *                 example: "#10B981"
 *               order_index:
 *                 type: integer
 *                 description: Updated order position
 *                 example: 1
 *     responses:
 *       200:
 *         description: Notebook updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notebook updated successfully
 *                 notebook:
 *                   $ref: '#/components/schemas/Notebook'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/', updateNotebook);

/**
 * @swagger
 * /api/notebooks:
 *   delete:
 *     summary: Delete a notebook
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notebook_id
 *             properties:
 *               notebook_id:
 *                 type: string
 *                 format: uuid
 *                 description: The notebook ID
 *     responses:
 *       200:
 *         description: Notebook deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notebook deleted successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/', deleteNotebook);

export default router;
