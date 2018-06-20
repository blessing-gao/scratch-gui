import PropTypes from 'prop-types';
import React from 'react';

const WorkTitle = props => {
    const {
        title
    } = props;

    return (
        <div style={{margin: '0px auto'}}>
            <p style={{textAlign: 'center', backgroundColor: 'rgba', fontFamily: 'Microsoft YaHei', color: '#777', outline: 'none', width: '200px'}}>{title}</p>
        </div>
    );
};
WorkTitle.prototypes = {
    title: PropTypes.string
};
WorkTitle.defaultProps = {
    title: '作品'
};
export default WorkTitle;
