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
// router.use(requireAuth);

/**
 * @swagger
 * /api/notebooks:
 *   get:
 *     summary: Get all notebooks (optionally filtered by folder)
 *     tags: [Notebooks]
 *     parameters:
 *       - in: query
 *         name: folder_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter notebooks by folder ID
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
 * @swagger
 * /api/notebooks/count/{id}:
 *   get:
 *     summary: Get count of all notebooks filtered by folder
 *     tags: [Notebooks]
 *     parameters:
 *       - in: query
 *         name: folder_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter notebooks by folder ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of notebooks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
router.get('/count', getAllNotebooksCount);

/**
 * @swagger
 * /api/notebooks/{id}:
 *   get:
 *     summary: Get a notebook by ID
 *     tags: [Notebooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notebook ID
 *     security:
 *       - bearerAuth: []
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
router.get('/:id', getNotebookById);

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
 *               - folder_id
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
 *               folder_id:
 *                 type: integer
 *                 description: ID of the folder this notebook belongs to
 *                 example: 1
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
 * /api/notebooks/{id}:
 *   put:
 *     summary: Update a notebook
 *     tags: [Notebooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notebook ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               folder_id:
 *                 type: integer
 *                 description: Updated folder ID
 *                 example: 2
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
router.put('/:id', updateNotebook);

/**
 * @swagger
 * /api/notebooks/{id}:
 *   delete:
 *     summary: Delete a notebook
 *     tags: [Notebooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notebook ID
 *     security:
 *       - bearerAuth: []
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
router.delete('/:id', deleteNotebook);

export default router;
