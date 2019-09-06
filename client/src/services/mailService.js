import callWebApi from 'src/helpers/webApiHelper';

export const sendResetPasswordEmail = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/mailer/resetPassword',
        type: 'POST',
        request
    });
    return response.text();
};

export const sharePostByEmail = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/mailer/sharePost',
        type: 'POST',
        request
    });
    return response.text();
};
