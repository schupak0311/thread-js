import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import ComposePost from 'src/components/ComposePost';

class EditPost extends React.Component {
    constructor(props) {
        super(props);

        this.handleSavePost = this.handleSavePost.bind(this);
    }

    handleSavePost = async (imageId, body) => {
        if (!body || (body === this.props.currentBody && imageId === this.props.currentImage)) {
            return;
        }
        await this.props.updatePost({ imageId, body });
        this.props.handleFinishEditing();
    };

    render() {
        return (
            <ComposePost
                body={this.props.currentBody}
                image={this.props.currentImage}
                placeholderText="Edit your post"
                saveAction={this.handleSavePost}
                uploadImage={this.props.uploadImage}
            >
                <Button floated="right" color="blue" type="submit">Save</Button>
                <Button floated="right" color="red" onClick={() => this.props.handleFinishEditing()}>Cancel</Button>
            </ComposePost>
        );
    }
}

EditPost.propTypes = {
    currentBody: PropTypes.string.isRequired,
    currentImage: PropTypes.string,
    handleFinishEditing: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

EditPost.defaultProps = {
    currentImage: undefined
};

export default EditPost;
