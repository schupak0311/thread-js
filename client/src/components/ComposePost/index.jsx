import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment } from 'semantic-ui-react';

import styles from './styles.module.scss';

const initialState = {
    body: '',
    imageId: undefined,
    imageLink: undefined
};

class ComposePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
            body: props.body,
            imageLink: props.image,
            isUploading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUploadFile = async ({ target }) => {
        this.setState({ isUploading: true });
        try {
            const { id: imageId, link: imageLink } = await this.props.uploadImage(target.files[0]);
            this.setState({ imageId, imageLink, isUploading: false });
        } catch {
            // TODO: show error
            this.setState({ isUploading: false });
        }
    };

    handleSubmit = () => {
        this.props.saveAction(this.state.imageId, this.state.body);
        this.setState(initialState);
    };

    render() {
        const { imageLink, body, isUploading } = this.state;
        const placeholder = this.props.placeholderText;
        return (
            <Segment>
                <Form onSubmit={this.handleSubmit}>
                    <Form.TextArea
                        name="body"
                        value={body}
                        placeholder={placeholder}
                        onChange={ev => this.setState({ body: ev.target.value })}
                    />
                    {imageLink && (
                        <div className={styles.imageWrapper}>
                            <Image className={styles.image} src={imageLink} alt="post" />
                        </div>
                    )}
                    <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
                        <Icon name="image" />
                        Attach image
                        <input name="image" type="file" onChange={this.handleUploadFile} hidden />
                    </Button>
                    {this.props.children}
                </Form>
            </Segment>
        );
    }
}

ComposePost.propTypes = {
    body: PropTypes.string,
    image: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    placeholderText: PropTypes.string,
    saveAction: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

ComposePost.defaultProps = {
    body: '',
    image: undefined,
    placeholderText: ''
};

export default ComposePost;
