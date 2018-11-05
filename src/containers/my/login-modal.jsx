import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import LoginModalComponent from '../../components/my/login-modal.jsx';
import {getQueryString} from '../../lib/request';
import request from '../../lib/request';
import {closeLoginModal} from '../../reducers/modals';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import fireKeyEvent from '../../lib/key-map';
// import Base64 from 'crypto-js/enc-base64';
// import UTF_8 from 'crypto-js/enc-utf8';
// import fireKeyEvent from '../lib/key-map';

class LoginModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'componentDidMount',
            'handleOnSave',
            'onHandleCancel'
        ]);
        this.state = {
            
        };
    }

    componentDidMount (){
        
    }

    handleOnSave (){
        
    }
    
    onHandleCancel () {
        this.props.closeLoginModal();
    }
    render () {
        /* eslint-disable no-unused-vars */
        return (
            <LoginModalComponent
                handleCancel={this.onHandleCancel}
                title="保存作品"
                handleOnSave={this.handleOnSave}
            />);
    }
}

LoginModal.propTypes = {
    closeLoginModal: PropTypes.func
};

const mapStateToProps = state => ({
    // work: state.scratchGui.scratch.work,
    // vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    closeLoginModal: () => {
        dispatch(closeLoginModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);
