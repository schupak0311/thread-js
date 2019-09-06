import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Button, Input } from 'semantic-ui-react';

import styles from './styles.module.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedStatus: this.props.user.status,
            editStatus: false
        };

        this.toggleEditStatus = this.toggleEditStatus.bind(this);
        this.handleEditStatus = this.handleEditStatus.bind(this);
        this.handleUpdateStatusValue = this.handleUpdateStatusValue.bind(this);
    }

    toggleEditStatus() {
        this.setState(({ editStatus }) => ({
            editStatus: !editStatus
        }));
    }

    handleEditStatus() {
        const { updatedStatus } = this.state;
        if (this.props.user.status === updatedStatus) {
            this.toggleEditStatus();
            return;
        }

        this.props.updateUser({ ...this.props.user, status: updatedStatus });
        this.toggleEditStatus();
    }

    handleUpdateStatusValue(updatedStatus) {
        this.setState({ updatedStatus });
    }

    render() {
        const { user, logout } = this.props;
        const { editStatus } = this.state;

        let subHeaderContent;
        if (editStatus) {
            subHeaderContent = (
                <Input
                    action={(
                        <>
                            <Button size="mini" color="red" onClick={this.toggleEditStatus}>Cancel</Button>
                            <Button size="mini" color="blue" onClick={this.handleEditStatus}>Save</Button>
                        </>
                    )}
                    size="mini"
                    placeholder="Status"
                    type="text"
                    onChange={(event, data) => {
                        this.handleUpdateStatusValue(data.value);
                    }}
                    defaultValue={user.status}
                />
            );
        } else {
            subHeaderContent = (
                <>
                    {user.status}
                    {'  '}
                    <Icon
                        link
                        color="black"
                        name="pencil"
                        className={styles.controlBtn}
                        onClick={this.toggleEditStatus}
                    />
                </>
            );
        }

        return (
            <div className={styles.headerWrp}>
                <Grid centered container columns="2">
                    <Grid.Column>
                        {user && (
                            <NavLink exact to="/profile">
                                <HeaderUI>
                                    <Image circular src={getUserImgLink(user.image)} />
                                    <HeaderUI.Content>
                                        {user.username}
                                        {user.status
                                        && (
                                            <HeaderUI.Subheader onClick={event => event.preventDefault()}>
                                                {subHeaderContent}
                                            </HeaderUI.Subheader>
                                        )}
                                    </HeaderUI.Content>
                                </HeaderUI>
                            </NavLink>
                        )}
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <NavLink exact activeClassName="active" to="/">
                            <Icon name="home" size="large" />
                        </NavLink>
                        <Button basic icon type="button" className={styles.logoutBtn} onClick={logout}>
                            <Icon name="log out" size="large" />
                        </Button>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    updateUser: PropTypes.func.isRequired,
};

export default Header;
