import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonComponent from '../components/button/button.jsx';

class UploadButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
        ]);
    }
    render () {
        const {
            uploadClick,
            ...props
        } = this.props;
        return (
            <ButtonComponent
                onClick={uploadClick}
                {...props}
            >
                保存
            </ButtonComponent>
        );
    }
}

UploadButton.propTypes = {
    saveProjectSb3: PropTypes.func,
    uploadClick: PropTypes.func
};
export default UploadButton;
