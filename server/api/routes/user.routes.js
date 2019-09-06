import { Router } from 'express';
import * as userService from '../services/user.service';

const router = Router();

router
    .get('/', (req, res, next) => userService.getUserByResetToken(req.query.resetPasswordToken)
        .then(data => res.send(data))
        .catch(next))
    .put('/', (req, res, next) => userService.updatePassword(req.body)
        .then(response => res.send(response))
        .catch(next));

export default router;
