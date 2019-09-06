import React from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI, Input, Image, Button, Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';
import ReactionList from 'src/components/ReactionList';

import styles from './styles.module.scss';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            showReactions: false,
            likeList: null
        };

        this.commentId = this.props.comment.id;
        this.commentBody = this.props.comment.body;

        this.toggleCommentMode = this.toggleCommentMode.bind(this);
        this.handleUpdateComment = this.handleUpdateComment.bind(this);
    }

    setReactionImages = (commentReactions) => {
        this.likedUserImages = commentReactions
            .slice(0, 5)
            .filter(reaction => reaction.isLike)
            .map((reaction, idx) => ({
                id: (reaction.user.image && reaction.user.image) || idx,
                link: getUserImgLink(reaction.user.image),
                user: reaction.user.username
            }));
        this.dislikedUserImages = commentReactions
            .slice(0, 5)
            .filter(reaction => !reaction.isLike)
            .map((reaction, idx) => ({
                id: (reaction.user.image && reaction.user.image) || idx,
                link: getUserImgLink(reaction.user.image),
                user: reaction.user.username
            }));
    };

    toggleCommentMode = () => {
        this.setState(state => ({ editMode: !state.editMode }));
    };

    handleUpdateComment = (updatedCommentBody) => {
        if (!updatedCommentBody || this.commentBody === updatedCommentBody) {
            this.toggleCommentMode();
            return;
        }

        this.props.updateComment({ body: updatedCommentBody }, this.commentId);
        this.toggleCommentMode();
    };

    openReactionList = (likeList) => {
        this.setState({ showReactions: true, likeList });
    };

    closeReactionList = () => {
        this.setState({ showReactions: false, likeList: null });
    };

    render() {
        const { comment, deleteComment, reactToComment } = this.props;
        const { showReactions, likeList } = this.state;
        const {
            id,
            body,
            likeCount,
            dislikeCount,
            createdAt,
            updatedAt,
            user,
            commentReactions
        } = comment;

        this.setReactionImages(commentReactions);

        const likedAvatars = this.likedUserImages.map(image => (
            <Popup
                trigger={<Image avatar src={image.link} />}
                content={image.user}
                position="top center"
                key={image.id}
            />
        ));
        const dislikedAvatars = this.dislikedUserImages.map(image => (
            <Popup
                trigger={<Image avatar src={image.link} />}
                content={image.user}
                position="top center"
                key={image.id}
            />
        ));

        let date;
        if (new Date(comment.updatedAt) <= new Date(comment.createdAt)) {
            date = moment(createdAt).fromNow();
            date = `posted ${date}`;
        } else {
            date = moment(updatedAt).fromNow();
            date = `last updated ${date}`;
        }

        const likeAction = (
            <CommentUI.Action onClick={() => reactToComment(id, true)}>
                <Icon name="thumbs up" />
                {likeCount}
            </CommentUI.Action>
        );
        const dislikeAction = (
            <CommentUI.Action onClick={() => reactToComment(id, false)}>
                <Icon name="thumbs down" />
                {dislikeCount}
            </CommentUI.Action>
        );

        let updatedText;
        let content;
        if (this.state.editMode) {
            content = (
                <Input
                    action
                    placeholder="Enter comment text"
                    defaultValue={body}
                    onChange={(event, data) => {
                        updatedText = data.value;
                    }}
                >
                    <input />
                    <Button color="red" onClick={() => this.toggleCommentMode()}>Cancel</Button>
                    <Button color="blue" onClick={() => this.handleUpdateComment(updatedText)}>Save</Button>
                </Input>
            );
        } else {
            content = (
                <>
                    <CommentUI.Author as="a">
                        {user.username}
                    </CommentUI.Author>
                    <CommentUI.Metadata>
                        {date}
                    </CommentUI.Metadata>
                    {user.status && <div className={styles.status}>{user.status}</div>}
                    <CommentUI.Text>
                        {body}
                    </CommentUI.Text>
                    <CommentUI.Actions>
                        {this.likedUserImages.length
                            ? (
                                <Popup
                                    hoverable
                                    position="top center"
                                    trigger={likeAction}
                                >
                                    {likedAvatars}
                                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                        <Button
                                            size="mini"
                                            onClick={() => this.openReactionList(true)}
                                        >
                                            Show all
                                        </Button>
                                    </div>
                                </Popup>
                            )
                            : likeAction
                        }
                        {this.dislikedUserImages.length
                            ? (
                                <Popup
                                    hoverable
                                    position="top center"
                                    trigger={dislikeAction}
                                >
                                    {dislikedAvatars}
                                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                        <Button
                                            size="mini"
                                            onClick={() => this.openReactionList(false)}
                                        >
                                            Show all
                                        </Button>
                                    </div>
                                </Popup>
                            )
                            : dislikeAction
                        }
                        {this.props.isCurrentUserComment
                            ? (
                                <>
                                    <CommentUI.Action onClick={() => this.toggleCommentMode()}>
                                        Edit
                                    </CommentUI.Action>
                                    <CommentUI.Action onClick={() => deleteComment(comment)}>
                                        Delete
                                    </CommentUI.Action>
                                </>
                            )
                            : null
                        }
                    </CommentUI.Actions>
                </>
            );
        }
        return (
            <CommentUI className={styles.comment}>
                <CommentUI.Avatar src={getUserImgLink(user.image)} />
                <CommentUI.Content>
                    {content}
                </CommentUI.Content>
                {
                    showReactions
                    && (likeList
                        ? (
                            <ReactionList
                                likeList
                                users={this.likedUserImages}
                                close={this.closeReactionList}
                            />
                        )
                        : (
                            <ReactionList
                                likeList={false}
                                users={this.dislikedUserImages}
                                close={this.closeReactionList}
                            />
                        ))
                }
            </CommentUI>
        );
    }
}

Comment.propTypes = {
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    isCurrentUserComment: PropTypes.bool.isRequired,
    updateComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    reactToComment: PropTypes.func.isRequired
};

export default Comment;
