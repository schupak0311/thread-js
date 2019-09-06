import { Router } from 'express';
import * as imageService from '../services/image.service';
import imageMiddleware from '../middlewares/image.middleware';

const router = Router();

router
    .get('/:id', (req, res, next) => imageService.getImageById(req.params.id)
        .then(imageLink => res.send(imageLink))
        .catch(next))
    .post('/', imageMiddleware, (req, res, next) => imageService.upload(req.file)
        .then(image => res.send(image))
        .catch(next));

export default router;
