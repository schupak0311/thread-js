import { Router } from 'express';
import * as commentService from '../services/comment.service';

const router = Router();

router
    .get('/:id', (req, res, next) => commentService.getCommentById(req.params.id)
        .then(comment => res.send(comment))
        .catch(next))
    .post('/', (req, res, next) => commentService.create(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then(comment => res.send(comment))
        .catch(next))
    .put('/react', (req, res, next) => commentService.setReaction(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then(reaction => res.send(reaction))
        .catch(next))
    .put('/:id', (req, res, next) => commentService.update(req.user.id, req.params.id, req.body)
        .then(comment => res.send(comment))
        .catch(next))
    .delete('/:id', (req, res, next) => commentService.deleteCommentById(req.params.id)
        .then(numOfDeletedRows => res.send({ numOfDeletedRows }))
        .catch(next));

export default router;
