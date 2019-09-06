import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon } from 'semantic-ui-react';
import EditPost from 'src/components/EditPost';
import moment from 'moment';

import styles from './styles.module.scss';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editMode: false };
        this.postId = this.props.post.id;

        this.togglePostMode = this.togglePostMode.bind(this);
        this.handleUpdatePost = this.handleUpdatePost.bind(this);
    }

    togglePostMode = () => {
        this.setState(state => ({ editMode: !state.editMode }));
    };

    handleUpdatePost = (post) => {
        this.props.updatePost(post, this.postId);
    };

    render() {
        const {
            post,
            isCurrentUserPost,
            likePost,
            dislikePost,
            toggleExpandedPost,
            sharePost,
            deletePost,
            uploadImage
        } = this.props;
        const {
            id,
            image,
            body,
            user,
            likeCount,
            dislikeCount,
            commentCount,
            createdAt,
            updatedAt
        } = post;
        let date;
        if (new Date(post.updatedAt) <= new Date(post.createdAt)) {
            date = moment(createdAt).fromNow();
            date = `Posted ${date}`;
        } else {
            date = moment(updatedAt).fromNow();
            date = `Last updated ${date}`;
        }
        let mainContent;
        if (this.state.editMode) {
            mainContent = (
                <EditPost
                    updatePost={this.handleUpdatePost}
                    uploadImage={uploadImage}
                    currentImage={image && image.link}
                    currentBody={body}
                    handleFinishEditing={this.togglePostMode}
                />
            );
        } else {
            mainContent = (
                <Card style={{ width: '100%' }}>
                    {image && <Image src={image.link} wrapped ui={false} />}
                    <Card.Content>
                        <Card.Meta>
                            <span className="date">
                                posted by
                                {' '}
                                {user.username}
                                {' - '}
                                {date}
                            </span>
                            { isCurrentUserPost
                                ? (
                                    <>
                                        <Icon link color="red" name="delete" className={styles.controlBtn} onClick={() => deletePost(id)} />
                                        <Icon link color="black" name="edit" className={styles.controlBtn} onClick={() => this.togglePostMode()} />
                                    </>
                                )
                                : null
                            }
                        </Card.Meta>
                        <Card.Description>
                            {body}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likePost(id)}>
                            <Icon name="thumbs up" />
                            {likeCount}
                        </Label>
                        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikePost(id)}>
                            <Icon name="thumbs down" />
                            {dislikeCount}
                        </Label>
                        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
                            <Icon name="comment" />
                            {commentCount}
                        </Label>
                        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
                            <Icon name="share alternate" />
                        </Label>
                    </Card.Content>
                </Card>
            );
        }
        return mainContent;
    }
}


Post.propTypes = {
    post: PropTypes.objectOf(PropTypes.any).isRequired,
    isCurrentUserPost: PropTypes.bool.isRequired,
    likePost: PropTypes.func.isRequired,
    dislikePost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    toggleExpandedPost: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

export default Post;
