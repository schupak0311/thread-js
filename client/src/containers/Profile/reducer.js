import { SET_USER, SET_IS_LOADING, SET_IMAGE_UPLOADER } from './actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.user,
                isAuthorized: Boolean(action.user && action.user.id)
            };
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        case SET_IMAGE_UPLOADER:
            return {
                ...state,
                imageUploader: action.isActive
            };
        default:
            return state;
    }
};
