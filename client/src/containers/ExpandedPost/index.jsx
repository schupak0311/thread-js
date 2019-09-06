import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import * as imageService from 'src/services/imageService';
import {
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    toggleExpandedPost,
    addComment,
    updateComment,
    deleteComment,
    reactToComment
} from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';

class ExpandedPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };

        this.handleDeletePost = this.handleDeletePost.bind(this);
    }

    closeModal = () => {
        this.props.toggleExpandedPost();
    };

    handleDeletePost = (postId) => {
        this.closeModal();
        this.props.deletePost(postId);
    };

    uploadImage = file => imageService.uploadImage(file);

    render() {
        const { post, sharePost, ...props } = this.props;
        return (
            <Modal dimmer centered={false} open={this.state.open} onClose={this.closeModal}>
                {post
                    ? (
                        <Modal.Content>
                            <Post
                                post={post}
                                isCurrentUserPost={this.props.userId === post.userId}
                                likePost={props.likePost}
                                dislikePost={props.dislikePost}
                                updatePost={props.updatePost}
                                deletePost={this.handleDeletePost}
                                toggleExpandedPost={props.toggleExpandedPost}
                                sharePost={sharePost}
                                uploadImage={this.uploadImage}
                            />
                            <CommentUI.Group style={{ maxWidth: '100%' }}>
                                <Header as="h3" dividing>
                                    Comments
                                </Header>
                                {post.comments && post.comments
                                    .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
                                    .map(comment => (
                                        <Comment
                                            key={comment.id}
                                            comment={comment}
                                            isCurrentUserComment={this.props.userId === comment.userId}
                                            updateComment={this.props.updateComment}
                                            deleteComment={this.props.deleteComment}
                                            reactToComment={this.props.reactToComment}
                                        />
                                    ))
                                }
                                <AddComment postId={post.id} addComment={props.addComment} />
                            </CommentUI.Group>
                        </Modal.Content>
                    )
                    : <Spinner />
                }
            </Modal>
        );
    }
}

ExpandedPost.propTypes = {
    post: PropTypes.objectOf(PropTypes.any).isRequired,
    userId: PropTypes.string,
    toggleExpandedPost: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    dislikePost: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    reactToComment: PropTypes.func.isRequired
};

ExpandedPost.defaultProps = {
    userId: undefined
};

const mapStateToProps = rootState => ({
    post: rootState.posts.expandedPost,
    userId: rootState.profile.user.id
});
const actions = {
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    toggleExpandedPost,
    addComment,
    updateComment,
    deleteComment,
    reactToComment,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExpandedPost);
