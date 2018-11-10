import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import LoginModalComponent from '../../components/my/login-modal.jsx';
import {getQueryString, encode64} from '../../lib/request';
import request from '../../lib/request';
import {closeLoginModal} from '../../reducers/modals';
import Cookies from 'universal-cookie';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import fireKeyEvent from '../../lib/key-map';
// import Base64 from 'crypto-js/enc-base64';
// import UTF_8 from 'crypto-js/enc-utf8';
// import fireKeyEvent from '../lib/key-map';
const cookies = new Cookies();

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

    handleOnSave ({phone, password}){
        // console.log(data);
        if(!phone || !password){
            alert("请先完善信息~");
            return;
        }
        let reqData = {
            platform:'mayuan',
            username: phone,
            password:encode64(password)
        };
        request.default_request(request.POST, JSON.stringify(reqData), '/api/login', result => {
            let msg = {
                type: 1,
                message: result.code == 0 ? '登录成功' : '登录失败',
                status: result.code == 0 ? 1 : 2,
                timeout: 2000,
                show: true
            };
            this.props.setConfirm(msg);
            if(result.code == 0){
                let token = data.result.token;
                let d = new Date();
                d.setTime(d.getTime() + (7*60*60*1000));
                // path设置为'/'时，该token所有页面都可访问，否则token会被默认设置在本页面之下，其他页面无法访问到该token
                cookies.set('token', token, {expires: d, path: '/', domain: '.imayuan.com'});
            }
        }, 'http://imayuan.com:8279');
    }

    onHandleCancel () {
        this.props.closeLoginModal();
    }
    render () {
        /* eslint-disable no-unused-vars */
        return (
            <LoginModalComponent
                handleCancel={this.onHandleCancel}
                title="登录"
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
