import cryptoHelper from '../../helpers/crypto.helper';
import userRepository from '../../data/repositories/user.repository';

export const getUserById = async (userId) => {
    const { id, username, email, imageId, image, status } = await userRepository.getUserById(userId);
    return { id, username, email, imageId, image, status };
};

export const getUserByResetToken = (token) => {
    return userRepository.getUserByResetToken(token).then((user) => {
        if (user) {
            return {
                username: user.username,
                message: 'OK'
            };
        }

        return {
            message: 'TOKEN INVALID'
        };
    });
};

export const updatePassword = async ({ username, password }) => userRepository.getByUsername(username)
    .then(user => cryptoHelper.encrypt(password)
        .then((hashedPassword) => {
            user.update({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            });
        })
        .then(() => ({ message: 'OK' })));

export const update = ({ id, ...data }) => userRepository.updateById(id, data);
