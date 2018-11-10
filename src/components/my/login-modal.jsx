import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './login-modal.css';
import classNames from 'classnames';
import loginBg from '../../lib/assets/login-bg.png';

const messages = {
    label: '登录'
};

const customStyles = {
    content : {
        top                   : '45%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        padding               : '0',
        background            : 'none',
        border                : '0'
    }
};

class LoginModalComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            "handleChangePhone",
            "handleChangePassword",
            "handleSubmit"
        ]);
        this.state = {
            phone: '',
            password: ''
        };
    }

    handleChangePhone(event){
        this.setState({
            phone: event.target.value
        })
    }

    handleChangePassword(event){
        this.setState({
            password: event.target.value
        })
    }

    handleSubmit(){
        this.props.handleOnSave({
            phone: this.state.phone,
            password: this.state.password
        });
    }


    render(){
        return (
            <ReactModal
                isOpen
                style={customStyles}
                contentLabel={messages.label}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.handleCancel}
            >
                <div className={styles.loginBox}>
                    <div className={styles.loginInner}>
                        <div className={styles.loginTop}>
                            <div className={
                                classNames(
                                    styles.loginType,
                                    styles.loginTypeAct
                                )}>密码登录</div>
                        </div>
                        <div className={styles.loginContent}>
                            <Box className={
                                classNames(
                                    styles.loginItem,
                                    styles.loginPhone
                                )}>
                                <input className={styles.loginInput} 
                                       type="text"
                                       placeholder="请输入您的手机号"
                                       onChange={this.handleChangePhone}
                                />
                            </Box>
                            <Box className={
                                classNames(
                                    styles.loginItem,
                                    styles.loginPsd
                                )}>
                                <input className={styles.loginInput} 
                                       type="password"
                                       placeholder="请输入您的密码"
                                       onChange={this.handleChangePassword}
                                />
                            </Box>
                        </div>
                        <div className={styles.loginBtn} onClick={this.handleSubmit}>登录</div>
                        <p className={styles.textCenter}>
                            <a href="#" className={styles.regHref}>新用户,点击前往注册</a>
                        </p>
                    </div>
                </div>
            </ReactModal>
        );
    }
}

LoginModalComponent.propTypes = {
    handleCancel: PropTypes.func.isRequired,
    handleOnSave: PropTypes.func.isRequired,
    title: PropTypes.string
};
LoginModalComponent.defaultProps = {
    title: '登录'
};

export default LoginModalComponent;
