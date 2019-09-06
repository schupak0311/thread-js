import commentRepository from '../../data/repositories/comment.repository';
import commentReactionRepository from '../../data/repositories/comment-reaction.repository';

export const create = (userId, comment) => commentRepository.create({
    ...comment,
    userId
});

export const update = (userId, commentId, comment) => commentRepository.updateById(commentId, comment);

export const deleteCommentById = commentId => commentRepository.deleteById(commentId);

export const getCommentById = id => commentRepository.getCommentById(id);

export const setReaction = async (userId, { commentId, isLike = true }) => {
    // define the callback for future use as a promise
    const updateOrDelete = react => (react.isLike === isLike
        ? commentReactionRepository.deleteById(react.id)
        : commentReactionRepository.updateById(react.id, { isLike }));

    const reaction = await commentReactionRepository.getCommentReaction(userId, commentId);

    const result = reaction
        ? await updateOrDelete(reaction)
        : await commentReactionRepository.create({ userId, commentId, isLike });

    // the result is an integer when an entity is deleted
    return Number.isInteger(result) ? {} : commentReactionRepository.getCommentReaction(userId, commentId);
};
