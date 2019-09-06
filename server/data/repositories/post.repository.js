import Sequelize from 'sequelize';
import sequelize from '../db/connection';
import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel, CommentReactionModel } from '../models/index';
import BaseRepository from './base.repository';

const { Op } = Sequelize;
const likeCase = (bool, table) => `CASE WHEN "${table}"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
    async getPosts(filter) {
        const {
            from: offset,
            count: limit,
            userId,
            except
        } = filter;

        const where = {};
        if (userId) {
            Object.assign(where, except === 'true' ? { userId: { [Op.ne]: userId } } : { userId });
        }

        return this.model.findAll({
            where,
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId" AND "comment"."deletedAt" IS NULL)`), 'commentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(true, 'postReactions'))), 'likeCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(false, 'postReactions'))), 'dislikeCount']
                ]
            },
            include: [{
                model: ImageModel,
                attributes: ['id', 'link']
            }, {
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: PostReactionModel,
                attributes: [],
                duplicating: false
            }],
            group: [
                'post.id',
                'image.id',
                'user.id',
                'user->image.id'
            ],
            order: [['createdAt', 'DESC']],
            offset,
            limit
        });
    }

    getPostById(id) {
        return this.model.findOne({
            group: [
                'post.id',
                'comments.id',
                'comments->user.id',
                'comments->user->image.id',
                'comments->commentReactions.id',
                'comments->commentReactions->user.id',
                'comments->commentReactions->user->image.id',
                'user.id',
                'user->image.id',
                'image.id'
            ],
            where: { id },
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId" AND "comment"."deletedAt" IS NULL)`), 'commentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(true, 'postReactions'))), 'likeCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(false, 'postReactions'))), 'dislikeCount']
                ]
            },
            separate: true,
            include: [{
                model: CommentModel,
                attributes: {
                    include: [
                        [sequelize.literal(`SUM(${likeCase(true, 'comments->commentReactions')}) OVER(PARTITION BY comments.id)`), 'likeCount'],
                        [sequelize.literal(`SUM(${likeCase(false, 'comments->commentReactions')}) OVER(PARTITION BY comments.id)`), 'dislikeCount']
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
            }, {
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: ImageModel,
                attributes: ['id', 'link']
            }, {
                model: PostReactionModel,
                attributes: []
            }]
        });
    }
}

export default new PostRepository(PostModel);
