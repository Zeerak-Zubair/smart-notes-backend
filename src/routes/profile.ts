import { Router } from 'express';
import {
  updateProfilePicture,
  getProfile
} from '../controllers/profileController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Profile not found
 */
router.get('/', getProfile);

/**
 * @swagger
 * /api/profile/picture:
 *   put:
 *     summary: Update profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture updated successfully
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/picture', upload.single('image'), updateProfilePicture);

export default router;
