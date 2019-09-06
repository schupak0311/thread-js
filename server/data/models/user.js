export default (orm, DataTypes) => {
    const User = orm.define('user', {
        email: {
            allowNull: false,
            type: DataTypes.STRING
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        status: {
            allowNull: true,
            type: DataTypes.STRING,
            unique: false
        },
        resetPasswordToken: {
            allowNull: true,
            type: DataTypes.STRING,
            unique: false
        },
        resetPasswordExpires: {
            allowNull: true,
            type: DataTypes.BIGINT,
            unique: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

    }, {});

    return User;
};
