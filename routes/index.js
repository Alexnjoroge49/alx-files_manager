import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = Router();

// status and stat route
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// users route
router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

// authenticate route
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

export default router;
