import { Router } from 'express';
import * as mailService from '../services/mail.service';
import * as userService from '../services/user.service';

const router = Router();

router
    .post('/resetPassword', (req, res, next) => mailService.sendPasswordResetEmail(req.body.email)
        .then(data => res.send(data))
        .catch(next))
    .post('/sharePost', (req, res, next) => {
        userService.getUserById(req.user.id).then(({ username }) => {
            mailService.sharePostByEmail(req.body.recipientsEmail, req.body.sharedPostId, username)
                .then(data => res.send(data))
                .catch(next);
        });
    });

export default router;
