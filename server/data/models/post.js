export default (orm, DataTypes) => {
    const Post = orm.define('post', {
        body: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        paranoid: true
    });

    return Post;
};
