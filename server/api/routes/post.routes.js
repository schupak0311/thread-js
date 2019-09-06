import { Router } from 'express';
import * as postService from '../services/post.service';
import * as userService from '../services/user.service';
import * as mailService from '../services/mail.service';

const router = Router();

router
    .get('/', (req, res, next) => postService.getPosts(req.query)
        .then(posts => res.send(posts))
        .catch(next))
    .get('/:id', (req, res, next) => postService.getPostById(req.params.id)
        .then(post => res.send(post))
        .catch(next))
    .post('/', (req, res, next) => postService.create(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then((post) => {
            req.io.emit('new_post', post); // notify all users that a new post was created
            return res.send(post);
        })
        .catch(next))
    .put('/react', (req, res, next) => postService.setReaction(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then((reaction) => {
            if (reaction.post && (reaction.post.userId !== req.user.id)) {
                // notify a user if someone (not himself) liked his post
                userService.getUserById(reaction.post.userId).then(({ email }) => {
                    mailService.sendNotificationEmail(email, req.user.username, reaction.post.id);
                });
                req.io.to(reaction.post.userId).emit('like', 'Your post was liked!');
            }
            return res.send(reaction);
        })
        .catch(next))
    .put('/:id', (req, res, next) => postService.update(req.user.id, req.params.id, req.body)
        .then(post => res.send(post))
        .catch(next))
    .delete('/:id', (req, res, next) => postService.deletePostById(req.params.id)
        .then(numOfDeletedRows => res.send({ numOfDeletedRows }))
        .catch(next));

export default router;
