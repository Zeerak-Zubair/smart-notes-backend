import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notesController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
// router.use(requireAuth);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes (optionally filtered by notebook)
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: notebook_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter notes by notebook ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *                   description: Total number of notes
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getNoteById);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
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
 *                 type: integer
 *                 description: ID of the notebook this note belongs to
 *                 example: 1
 *               content:
 *                 type: string
 *                 description: Note content
 *                 example: This is my first note
 *               order_index:
 *                 type: integer
 *                 description: Order position of the note
 *                 example: 0
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note created successfully
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated note content
 *                 example: Updated note content
 *               notebook_id:
 *                 type: integer
 *                 description: Updated notebook ID
 *                 example: 2
 *               order_index:
 *                 type: integer
 *                 description: Updated order position
 *                 example: 1
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note updated successfully
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note deleted successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteNote);

export default router;
