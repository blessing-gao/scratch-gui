import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ReactModal from 'react-modal';
import Box from '../../components/box/box.jsx';
import styles from './style.css';
import classNames from 'classnames';

const messages = {
    label: '登录'
};

const customStyles = {
    content: {
        top: '45%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        background: 'none',
        border: '0'
    }
};

class LoginComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangePhone',
            'handleChangePassword',
            'handleSubmit',
            'handleTurnRegister'
        ]);
        this.state = {
            phone: '',
            password: ''
        };
    }

    handleChangePhone (event){
        this.setState({
            phone: event.target.value
        });
    }

    handleChangePassword (event){
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit (){
        this.props.onHandleSave({
            phone: this.state.phone,
            password: this.state.password
        });
    }

    handleTurnRegister (){
        window.location.href = 'https://imayuan.com/login';
    }


    render (){
        return (
            <ReactModal
                contentLabel={messages.label}
                isOpen
                onRequestClose={this.props.onHandleCancel}
                overlayClassName={styles.modalOverlay}
                style={customStyles}
            >
                <div className={styles.loginBox}>
                    <div className={styles.loginInner}>
                        <div className={styles.loginTop}>
                            <div
                                className={
                                    classNames(
                                        styles.loginType,
                                        styles.loginTypeAct
                                    )}
                            >密码登录</div>
                        </div>
                        <div className={styles.loginContent}>
                            <Box
                                className={
                                    classNames(
                                        styles.loginItem,
                                        styles.loginPhone
                                    )}
                            >
                                <input
                                    className={styles.loginInput}
                                    placeholder="请输入您的手机号"
                                    type="text"
                                    onChange={this.handleChangePhone}
                                />
                            </Box>
                            <Box
                                className={
                                    classNames(
                                        styles.loginItem,
                                        styles.loginPsd
                                    )}
                            >
                                <input
                                    className={styles.loginInput}
                                    onChange={this.handleChangePassword}
                                    placeholder="请输入您的密码"
                                    type="password"
                                />
                            </Box>
                        </div>
                        <div
                            className={styles.loginBtn}
                            onClick={this.handleSubmit}
                        >{messages.label}</div>
                        <p className={styles.textCenter}>
                            <a
                                className={styles.regHref}
                                href="//imayuan.com/login"
                                target="_blank"
                                onClick={this.handleTurnRegister}
                            >新用户,点击前往注册</a>
                        </p>
                    </div>
                </div>
            </ReactModal>
        );
    }
}

LoginComponent.propTypes = {
    onHandleCancel: PropTypes.func.isRequired,
    onHandleSave: PropTypes.func.isRequired
};


LoginComponent.defaultProps = {
    onHandleSave: () => {}
};

export default LoginComponent;
