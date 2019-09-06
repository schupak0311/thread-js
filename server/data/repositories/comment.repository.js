import { CommentModel, UserModel, ImageModel, CommentReactionModel } from '../models/index';
import BaseRepository from './base.repository';
import sequelize from '../db/connection';

const likeCase = bool => `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class CommentRepository extends BaseRepository {
    getCommentById(id) {
        return this.model.findOne({
            group: [
                'comment.id',
                'user.id',
                'user->image.id',
                'commentReactions.id',
                'commentReactions->user.id',
                'commentReactions->user->image.id',
            ],
            where: { id },
            attributes: {
                include: [
                    [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(false))), 'dislikeCount']
                ]
            },
            include: [{
                model: UserModel,
                attributes: ['id', 'username', 'status'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: CommentReactionModel,
                attributes: ['isLike'],
                include: {
                    model: UserModel,
                    attributes: ['id', 'username', 'status'],
                    include: {
                        model: ImageModel,
                        attributes: ['id', 'link']
                    }
                }
            }]
        });
    }
}

export default new CommentRepository(CommentModel);
