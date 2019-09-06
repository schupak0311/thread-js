import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/comments',
        type: 'POST',
        request
    });
    return response.json();
};

export const updateComment = async (request, commentId) => {
    const response = await callWebApi({
        endpoint: `/api/comments/${commentId}`,
        type: 'PUT',
        request
    });
    return response.json();
};

export const deleteComment = async (commentId) => {
    const response = await callWebApi({
        endpoint: `/api/comments/${commentId}`,
        type: 'DELETE'
    });
    return response.json();
};

export const getComment = async (commentId) => {
    const response = await callWebApi({
        endpoint: `/api/comments/${commentId}`,
        type: 'GET'
    });
    return response.json();
};

export const reactToComment = async (commentId, isLike) => {
    const response = await callWebApi({
        endpoint: '/api/comments/react',
        type: 'PUT',
        request: {
            commentId,
            isLike
        }
    });
    return response.json();
};
