import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import ComposePost from 'src/components/ComposePost';

class AddPost extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddPost = this.handleAddPost.bind(this);
    }

    handleAddPost = async (imageId, body) => {
        if (!body) {
            return;
        }
        await this.props.addPost({ imageId, body });
    };

    render() {
        return (
            <ComposePost placeholderText="What is the news?" saveAction={this.handleAddPost} uploadImage={this.props.uploadImage}>
                <Button floated="right" color="blue" type="submit">Post</Button>
            </ComposePost>
        );
    }
}

AddPost.propTypes = {
    addPost: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

export default AddPost;
