import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import LoginModalComponent from '../../components/my/login-modal.jsx';
import {getQueryString, encode64} from '../../lib/request';
import request from '../../lib/request';
import {closeLoginModal} from '../../reducers/modals';
import {setConfirm,setConfirmBack} from '../../reducers/confirm';
import Cookies from 'universal-cookie';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {setWork} from "../../reducers/scratch";
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
                let token = result.result.token;
                // let userInfo = result.result.userMsg.userInfo;
                // let work = {...this.props.work};
                // work.nickname = userInfo.nickname || 'mayuan';
                // work.picUrl = userInfo.cover || '';
                // work.userId = result.result.userId;
                // this.props.setWork(work);
                // 设置token
                let d = new Date();
                d.setTime(d.getTime() + (15*60*60*1000));
                // todo 修改domain到imayuan下
                // cookies.set('token', token, {expires: d, path: '/'});
                cookies.set('token', token, {expires: d, path: '/', domain: '.imayuan.com'});
                // this.props.closeLoginModal();
                window.location.reload();
            }
        }, 'http://imayuan.com:8279','application/json');
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
    work: state.scratchGui.scratch.work,
    // vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    closeLoginModal: () => {
        dispatch(closeLoginModal());
    },
    setConfirm:(confirm) => {dispatch(setConfirm(confirm));},
    setWork:work => {dispatch(setWork(work));},
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);
