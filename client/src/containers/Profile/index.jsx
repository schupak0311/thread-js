import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { bindActionCreators } from 'redux';
import {
    Button,
    Grid,
    Icon,
    Image,
    Input
} from 'semantic-ui-react';
import ImageUploader from '../ImageUploader';
import { updateUser, toggleImageUploader } from './actions';

import styles from './styles.module.scss';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedUsername: this.props.user.username,
            updatedStatus: '',
            editUsername: false,
            editStatus: false
        };

        this.toggleEditField = this.toggleEditField.bind(this);
        this.handleEditUsername = this.handleEditUsername.bind(this);
        this.handleEditStatus = this.handleEditStatus.bind(this);
        this.toggleEditPhoto = this.toggleEditPhoto.bind(this);
        this.handleUpdateStateValue = this.handleUpdateStateValue.bind(this);
    }

    componentDidMount() {
        const imageContainer = document.querySelector(`.${styles.imageContainer}`);
        imageContainer.addEventListener('mouseenter', (event) => {
            event.target.lastElementChild.classList.add(styles.show);
        });
        imageContainer.addEventListener('mouseleave', (event) => {
            event.target.lastElementChild.classList.remove(styles.show);
        });
    }

    toggleEditField = fieldName => (event) => {
        if (event && event.relatedTarget && event.relatedTarget.tagName === 'BUTTON') return;

        this.setState(state => ({
            [fieldName]: !state[fieldName]
        }));
    };

    handleUpdateStateValue = stateProp => (value) => {
        this.setState({ [stateProp]: value });
    };

    toggleEditPhoto() {
        this.props.toggleImageUploader();
    }

    handleEditUsername() {
        const { updatedUsername } = this.state;
        if (!updatedUsername || this.props.user.username === updatedUsername) {
            this.toggleEditField('editUsername')();
            return;
        }

        this.props.updateUser({ ...this.props.user, username: updatedUsername });
        this.toggleEditField('editUsername')();
    }

    handleEditStatus() {
        const { updatedStatus } = this.state;
        if (this.props.user.status === updatedStatus) {
            this.toggleEditField('editStatus')();
            return;
        }

        this.props.updateUser({ ...this.props.user, status: updatedStatus });
        this.toggleEditField('editStatus')();
    }

    render() {
        const { user, imageUploader } = this.props;
        const { editUsername, editStatus } = this.state;
        const {
            username,
            email,
            status
        } = user;

        return (
            <Grid container textAlign="center" style={{ paddingTop: 30 }}>
                <Grid.Column>
                    <div className={styles.imageContainer}>
                        <Image centered src={getUserImgLink(user.image)} size="medium" circular />
                        <div className={styles.iconContainer}>
                            <Icon circular inverted name="photo" size="huge" onClick={this.toggleEditPhoto} />
                        </div>
                    </div>
                    <br />
                    <Input
                        action={editUsername
                            ? (
                                <>
                                    <Button color="red" onClick={this.toggleEditField('editUsername')}>Cancel</Button>
                                    <Button color="blue" onClick={this.handleEditUsername}>Save</Button>
                                </>
                            )
                            : null
                        }
                        icon="user"
                        iconPosition="left"
                        placeholder="Username"
                        type="text"
                        onFocus={this.toggleEditField('editUsername')}
                        onBlur={this.toggleEditField('editUsername')}
                        onChange={(event, data) => {
                            this.handleUpdateStateValue('updatedUsername')(data.value);
                        }}
                        defaultValue={username}
                    />
                    <br />
                    <br />
                    <Input
                        icon="at"
                        iconPosition="left"
                        placeholder="Email"
                        type="email"
                        disabled
                        value={email}
                    />
                    <br />
                    <br />
                    <Input
                        action={editStatus
                            ? (
                                <>
                                    <Button color="red" onClick={this.toggleEditField('editStatus')}>Cancel</Button>
                                    <Button color="blue" onClick={this.handleEditStatus}>Save</Button>
                                </>
                            )
                            : null
                        }
                        icon="info"
                        iconPosition="left"
                        placeholder="Status"
                        type="text"
                        onFocus={this.toggleEditField('editStatus')}
                        onBlur={this.toggleEditField('editStatus')}
                        onChange={(event, data) => {
                            this.handleUpdateStateValue('updatedStatus')(data.value);
                        }}
                        defaultValue={status}
                    />
                </Grid.Column>
                {
                    imageUploader
                    && (
                        <ImageUploader
                            user={this.props.user}
                            toggleImageUploader={this.props.toggleImageUploader}
                            updateUser={this.props.updateUser}
                        />
                    )
                }
            </Grid>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    updateUser: PropTypes.func.isRequired,
    imageUploader: PropTypes.bool,
    toggleImageUploader: PropTypes.func.isRequired
};

Profile.defaultProps = {
    user: {},
    imageUploader: undefined
};

const mapStateToProps = rootState => ({
    user: rootState.profile.user,
    imageUploader: rootState.profile.imageUploader
});

const actions = { updateUser, toggleImageUploader };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
