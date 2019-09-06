import orm from '../db/connection';
import associate from '../db/associations';

const User = orm.import('./user');
const Post = orm.import('./post');
const PostReaction = orm.import('./post-reaction');
const Comment = orm.import('./comment');
const CommentReaction = orm.import('./comment-reaction');
const Image = orm.import('./image');

associate({
    User,
    Post,
    PostReaction,
    Comment,
    CommentReaction,
    Image
});

export {
    User as UserModel,
    Post as PostModel,
    PostReaction as PostReactionModel,
    Comment as CommentModel,
    CommentReaction as CommentReactionModel,
    Image as ImageModel
};
