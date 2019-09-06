import callWebApi from 'src/helpers/webApiHelper';

export const getResetStatus = async (resetPasswordToken) => {
    const response = await callWebApi({
        endpoint: '/api/users',
        type: 'GET',
        query: { resetPasswordToken }
    });
    return response.json();
};

export const updateUserPassword = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/users',
        type: 'PUT',
        request
    });
    return response.json();
};
