import { CommentReactionModel, CommentModel } from '../models/index';
import BaseRepository from './base.repository';

class CommentReactionRepository extends BaseRepository {
    getCommentReaction(userId, commentId) {
        return this.model.findOne({
            group: [
                'commentReaction.id',
                'comment.id'
            ],
            where: { userId, commentId },
            include: [{
                model: CommentModel,
                attributes: ['id', 'userId']
            }]
        });
    }
}

export default new CommentReactionRepository(CommentReactionModel);
