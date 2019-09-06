import * as authService from 'src/services/authService';
import { loadPosts } from '../Thread/actions';
import { SET_USER, SET_IS_LOADING, SET_IMAGE_UPLOADER } from './actionTypes';

const setToken = token => localStorage.setItem('token', token);

const setUser = user => async dispatch => dispatch({
    type: SET_USER,
    user
});

const setIsLoading = isLoading => async dispatch => dispatch({
    type: SET_IS_LOADING,
    isLoading
});

const setAuthData = (user = null, token = '') => (dispatch, getRootState) => {
    setToken(token); // token should be set first before user
    setUser(user)(dispatch, getRootState);
};

const setImageUploaderAction = isActive => ({
    type: SET_IMAGE_UPLOADER,
    isActive
});

const handleAuthResponse = authResponsePromise => async (dispatch, getRootState) => {
    const { user, token } = await authResponsePromise;
    setAuthData(user, token)(dispatch, getRootState);
};

export const login = request => handleAuthResponse(authService.login(request));

export const registration = request => handleAuthResponse(authService.registration(request));

export const logout = () => setAuthData();

export const loadCurrentUser = () => async (dispatch, getRootState) => {
    setIsLoading(true)(dispatch, getRootState);
    const user = await authService.getCurrentUser();
    setUser(user)(dispatch, getRootState);
    setIsLoading(false)(dispatch, getRootState);
};

export const updateUser = userData => async (dispatch, getRootState) => {
    await authService.updateUser(userData);
    const updatedUser = await authService.getCurrentUser();

    dispatch(loadPosts());
    setUser(updatedUser)(dispatch, getRootState);
};

export const toggleImageUploader = () => async (dispatch, getRootState) => {
    const { profile: { imageUploader } } = getRootState();
    dispatch(setImageUploaderAction(!imageUploader));
};
