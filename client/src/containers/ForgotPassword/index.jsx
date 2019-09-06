import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { NavLink, Redirect } from 'react-router-dom';
import Logo from 'src/components/Logo';
import { sendResetPasswordEmail } from 'src/services/mailService';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isEmailValid: true,
            showError: false,
            messageFromServer: ''
        };

        this.sendEmail = this.sendEmail.bind(this);
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    validateEmail = () => {
        const { email } = this.state;
        const isEmailValid = validator.isEmail(email);
        this.setState({ isEmailValid });
        return isEmailValid;
    };

    sendEmail = async (event) => {
        event.preventDefault();
        const { email } = this.state;
        if (email === '') {
            this.setState({
                showError: false,
                messageFromServer: ''
            });
        } else {
            const result = await sendResetPasswordEmail({ email });

            if (result === 'OK') {
                this.setState({
                    showError: false,
                    messageFromServer: result
                });
            } else if (result === 'USER NOT FOUND') {
                this.setState({
                    showError: true,
                    messageFromServer: ''
                });
            }
        }
    };

    render() {
        const { isEmailValid, messageFromServer, showError } = this.state;
        return !this.props.isAuthorized
            ? (
                <Grid textAlign="center" verticalAlign="middle" className="fill">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Logo />
                        <Header as="h2" color="teal" textAlign="center">
                            Enter email linked to your account
                        </Header>
                        <Form name="registrationForm" size="large" onSubmit={this.sendEmail}>
                            <Segment>
                                <Form.Input
                                    fluid
                                    icon="at"
                                    iconPosition="left"
                                    placeholder="Email"
                                    type="email"
                                    error={!isEmailValid}
                                    onChange={this.handleChange('email')}
                                    onBlur={this.validateEmail}
                                />
                                <Button type="submit" color="teal" fluid size="large" primary>
                                    Reset password
                                </Button>
                            </Segment>
                        </Form>
                        {showError && (
                            <Message negative>
                                No accounts linked to this email. Try again or
                                <NavLink exact to="/registration"> register a new one.</NavLink>
                            </Message>
                        )}
                        {messageFromServer === 'OK' && (
                            <Message positive>
                                Email with reset link was successfully sent
                            </Message>
                        )}
                    </Grid.Column>
                </Grid>
            )
            : <Redirect to="/" />;
    }
}

ForgotPassword.propTypes = {
    isAuthorized: PropTypes.bool
};

ForgotPassword.defaultProps = {
    isAuthorized: undefined
};

export default ForgotPassword;
