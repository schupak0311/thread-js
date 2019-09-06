import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Logo from 'src/components/Logo';
import Spinner from 'src/components/Spinner';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { getResetStatus, updateUserPassword } from 'src/services/userService';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            updated: false,
            isLoading: true,
            error: false,
        };
    }

    async componentDidMount() {
        const token = this.props.location.pathname.split('/').pop();

        const response = await getResetStatus(token);

        if (response.message === 'OK') {
            this.setState({
                username: response.username,
                updated: false,
                isLoading: false,
                error: false,
            });
        } else {
            this.setState({
                updated: false,
                isLoading: false,
                error: true,
            });
        }
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    updatePassword = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        const token = this.props.location.pathname.split('/').pop();

        try {
            const response = await updateUserPassword({
                username,
                password,
                resetPasswordToken: token,
            });

            if (response.message === 'OK') {
                this.setState({
                    updated: true,
                    error: false,
                });
            } else {
                this.setState({
                    updated: false,
                    error: true,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const { error, isLoading, updated } = this.state;

        let content;
        if (error) {
            content = (
                <Message negative>
                    Problem resetting password. Please send another
                    <NavLink exact to="/reset"> reset link.</NavLink>
                </Message>
            );
        } else {
            content = (
                <>
                    <Logo />
                    <Header as="h2" color="teal" textAlign="center">
                        Enter new password
                    </Header>
                    <Form name="loginForm" size="large" onSubmit={this.updatePassword}>
                        <Segment>
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                onChange={this.handleChange('password')}
                            />
                            <Button type="submit" color="teal" fluid size="large" primary>
                                Update password
                            </Button>
                        </Segment>
                    </Form>
                    {updated && (
                        <Message positive>
                            Your password has been successfully reset, please try
                            <NavLink exact to="/login"> logging in </NavLink>
                            again.
                        </Message>
                    )}
                </>
            );
        }

        return (isLoading
            ? <Spinner />
            : (
                <Grid textAlign="center" verticalAlign="middle" className="fill">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        {content}
                    </Grid.Column>
                </Grid>
            )
        );
    }
}

ResetPassword.propTypes = {
    // eslint-disable-next-line react/require-default-props
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
};
