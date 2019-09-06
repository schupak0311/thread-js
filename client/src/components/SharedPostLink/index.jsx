import React from 'react';
import PropTypes from 'prop-types';
import { Message, Modal, Input, Icon } from 'semantic-ui-react';
import validator from 'validator';

import styles from './styles.module.scss';

class SharedPostLink extends React.Component {
    state = {
        copied: false,
        shared: false,
        recipientsEmail: '',
        isEmailValid: true,
        error: false
    };

    copyToClipboard = (e) => {
        this.input.select();
        document.execCommand('copy');
        e.target.focus();
        this.setState({ copied: true });
    };

    sharePostByEmail = async () => {
        const valid = this.validateEmail();
        if (!valid) return;

        const response = await this.props.sharePostByEmail(this.state.recipientsEmail, this.props.postId);
        
        if (response === 'OK') {
            this.setState({ error: false, shared: true });
        } else {
            this.setState({ error: true, shared: false });
        }
    };

    validateEmail = () => {
        const { recipientsEmail } = this.state;
        const isEmailValid = !validator.isEmpty(recipientsEmail) && validator.isEmail(recipientsEmail);
        this.setState({ isEmailValid });
        return isEmailValid;
    };

    handleUpdateEmailValue(recipientsEmail) {
        this.setState({ recipientsEmail });
    }

    render() {
        const { postId, close } = this.props;
        const { copied, shared, isEmailValid, error } = this.state;
        return (
            <Modal open onClose={close}>
                <Modal.Header className={styles.header}>
                    <span>Share Post</span>
                    <div>
                        {copied && (
                            <span className={styles.statusIcon}>
                                <Icon color="green" name="copy" />
                                Copied
                            </span>
                        )}
                        {shared && (
                            <span className={styles.statusIcon}>
                                <Icon color="green" name="mail" />
                                Shared
                            </span>
                        )}
                    </div>
                </Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy', onClick: this.copyToClipboard }}
                        value={`${window.location.origin}/share/${postId}`}
                        ref={(input) => { this.input = input; }}
                    />
                    <div style={{ textAlign: 'center ', margin: '10px 0' }}>Or</div>
                    <Input
                        fluid
                        action={{ color: 'blue', content: 'Share By Email', onClick: this.sharePostByEmail }}
                        icon="at"
                        iconPosition="left"
                        placeholder="Enter the recipient's email"
                        type="email"
                        error={!isEmailValid}
                        onBlur={this.validateEmail}
                        onChange={(event, data) => {
                            this.handleUpdateEmailValue(data.value);
                        }}
                    />
                    {error && (
                        <Message style={{ textAlign: 'center ' }} negative>
                            No user associated with this email
                        </Message>
                    )}
                </Modal.Content>
            </Modal>
        );
    }
}

SharedPostLink.propTypes = {
    postId: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    sharePostByEmail: PropTypes.func.isRequired
};

export default SharedPostLink;
