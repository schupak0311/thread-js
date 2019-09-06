import React from 'react';
import PropTypes from 'prop-types';
import { Image, Modal, List } from 'semantic-ui-react';

const ReactionList = (props) => {
    const { likeList, users, close } = props;

    return (
        <Modal
            open
            onClose={close}
        >
            <Modal.Header>
                {likeList ? 'Likes' : 'Dislikes'}
            </Modal.Header>
            <Modal.Content>
                <List divided verticalAlign="middle" size="huge">
                    {
                        users.map(({ id, user, link }) => (
                            <List.Item key={id}>
                                <Image avatar src={link} />
                                <List.Content>
                                    <List.Header as="a">{user}</List.Header>
                                </List.Content>
                            </List.Item>
                        ))
                    }
                </List>
            </Modal.Content>
        </Modal>
    );
};

ReactionList.propTypes = {
    likeList: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    close: PropTypes.func.isRequired
};

export default ReactionList;
