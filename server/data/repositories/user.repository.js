import Sequelize from 'sequelize';
import { UserModel, ImageModel } from '../models/index';
import BaseRepository from './base.repository';

const { Op } = Sequelize;

class UserRepository extends BaseRepository {
    addUser(user) {
        return this.create(user);
    }

    getByEmail(email) {
        return this.model.findOne({ where: { email } });
    }

    getByUsername(username) {
        return this.model.findOne({ where: { username } });
    }

    getUserById(id) {
        return this.model.findOne({
            group: [
                'user.id',
                'image.id'
            ],
            where: { id },
            include: {
                model: ImageModel,
                attributes: ['id', 'link']
            }
        });
    }

    getUserByResetToken(token) {
        return this.model.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [Op.gt]: Date.now()
                }
            }
        });
    }
}

export default new UserRepository(UserModel);
