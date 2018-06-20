import PropTypes from 'prop-types';
import React from 'react';

const UserComponent = props => {
    const {
        name
    } = props;

    return (
        <div style={{margin: '0px auto'}}>
            <p style={''}>{name}</p>
        </div>
    );
};
UserComponent.prototypes = {
    name: PropTypes.string.isRequired
};

export default UserComponent;
