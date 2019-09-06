export default (orm, DataTypes) => {
    const Comment = orm.define('comment', {
        body: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        paranoid: true
    });

    return Comment;
};
