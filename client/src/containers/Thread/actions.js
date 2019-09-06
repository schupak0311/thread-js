import * as postService from 'src/services/postService';
import * as imageService from 'src/services/imageService';
import * as commentService from 'src/services/commentService';
import {
    ADD_POST,
    LOAD_MORE_POSTS,
    SET_ALL_POSTS,
    SET_EXPANDED_POST
} from './actionTypes';

const setPostsAction = posts => ({
    type: SET_ALL_POSTS,
    posts
});

const addMorePostsAction = posts => ({
    type: LOAD_MORE_POSTS,
    posts
});

const addPostAction = post => ({
    type: ADD_POST,
    post
});

const setExpandedPostAction = post => ({
    type: SET_EXPANDED_POST,
    post
});

export const loadPosts = filter => async (dispatch) => {
    const posts = await postService.getAllPosts(filter);
    dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
    const { posts: { posts } } = getRootState();
    const loadedPosts = await postService.getAllPosts(filter);
    const filteredPosts = loadedPosts
        .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
    dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async (dispatch) => {
    const post = await postService.getPost(postId);
    dispatch(addPostAction(post));
};

export const addPost = post => async (dispatch) => {
    const { id } = await postService.addPost(post);
    const newPost = await postService.getPost(id);
    dispatch(addPostAction(newPost));
};

export const updatePost = (postData, postId) => async (dispatch, getRootState) => {
    const updatedPost = await postService.updatePost(postData, postId);

    let updatedImage = null;
    if (updatedPost.imageId) {
        updatedImage = await imageService.getImage(updatedPost.imageId);
    }

    const mapBody = post => ({
        ...post,
        image: updatedImage,
        updatedAt: updatedPost.updatedAt,
        body: updatedPost.body
    });

    const { posts: { posts, expandedPost } } = getRootState();
    const updated = posts.map(post => (post.id !== postId ? post : mapBody(post)));

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === postId) {
        dispatch(setExpandedPostAction(mapBody(expandedPost)));
    }
};

export const deletePost = postId => async (dispatch) => {
    await postService.deletePost(postId);
    dispatch(loadPosts());
};

export const toggleExpandedPost = postId => async (dispatch) => {
    const post = postId ? await postService.getPost(postId) : undefined;
    dispatch(setExpandedPostAction(post));
};

export const likePost = postId => async (dispatch, getRootState) => {
    const { id } = await postService.likePost(postId);
    const { dislikeCount } = await postService.getPost(postId);
    const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

    const mapLikes = post => ({
        ...post,
        dislikeCount,
        likeCount: Number(post.likeCount) + diff // diff is taken from the current closure
    });

    const { posts: { posts, expandedPost } } = getRootState();
    const updated = posts.map(post => (post.id !== postId ? post : mapLikes(post)));

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === postId) {
        dispatch(setExpandedPostAction(mapLikes(expandedPost)));
    }
};

export const dislikePost = postId => async (dispatch, getRootState) => {
    const { id } = await postService.dislikePost(postId);
    const { likeCount } = await postService.getPost(postId);
    const diff = id ? 1 : -1; // if ID exists then the post was disliked, otherwise - dislike was removed

    const mapDislikes = post => ({
        ...post,
        likeCount,
        dislikeCount: Number(post.dislikeCount) + diff // diff is taken from the current closure
    });

    const { posts: { posts, expandedPost } } = getRootState();
    const updated = posts.map(post => (post.id !== postId ? post : mapDislikes(post)));

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === postId) {
        dispatch(setExpandedPostAction(mapDislikes(expandedPost)));
    }
};

export const addComment = request => async (dispatch, getRootState) => {
    const { id } = await commentService.addComment(request);
    const comment = await commentService.getComment(id);
    const updatedExpandedPost = await postService.getPost(comment.postId);

    const mapComments = post => ({
        ...post,
        commentCount: Number(post.commentCount) + 1,
        comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const { posts: { posts, expandedPost } } = getRootState();
    const updated = posts.map(post => (post.id !== comment.postId
        ? post
        : mapComments(post)));

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === comment.postId) {
        dispatch(setExpandedPostAction(updatedExpandedPost));
    }
};

export const updateComment = (request, commentId) => async (dispatch, getRootState) => {
    const { id } = await commentService.updateComment(request, commentId);
    const updatedComment = await commentService.getComment(id);

    const mapPostComments = post => ({
        ...post,
        comments: post.comments && post.comments.map(comment => (comment.id !== updatedComment.id
            ? comment
            : updatedComment))
    });

    const { posts: { posts, expandedPost } } = getRootState();
    const updated = posts.map(post => (post.id !== updatedComment.postId
        ? post
        : mapPostComments(post)));

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === updatedComment.postId) {
        dispatch(setExpandedPostAction(mapPostComments(expandedPost)));
    }
};

export const deleteComment = comment => async (dispatch) => {
    await commentService.deleteComment(comment.id);
    const post = await postService.getPost(comment.postId);

    dispatch(loadPosts());
    dispatch(setExpandedPostAction(post));
};

export const reactToComment = (commentId, isLike) => async (dispatch) => {
    await commentService.reactToComment(commentId, isLike);
    const updatedComment = await commentService.getComment(commentId);
    const updatedPost = await postService.getPost(updatedComment.postId);

    dispatch(setExpandedPostAction(updatedPost));
};
