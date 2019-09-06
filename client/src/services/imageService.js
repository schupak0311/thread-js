import callWebApi from 'src/helpers/webApiHelper';

export const uploadImage = async (image) => {
    const response = await callWebApi({
        endpoint: '/api/images',
        type: 'POST',
        attachment: image
    });
    return response.json();
};

export const getImage = async (imageId) => {
    const response = await callWebApi({
        endpoint: `/api/images/${imageId}`,
        type: 'GET'
    });
    return response.json();
};
