import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './login-modal.css';
import classNames from 'classnames';
import logo from '../../lib/assets/logo.png';

const messages = {
    label: '登录'
};

class LoginModalComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            "handleChangePhone"
        ]);
        this.state = {
            
        };
    }

    handleChangePhone(event){
        console.log(event.target.value);
    }
    

    render(){
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                contentLabel={messages.label}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.handleCancel}
            >
                <Box className={styles.body}>
                    <Box className={styles.label}>
                        <img className={styles.logo} src={logo}/>
                    </Box>
                    <Box>
                        <input className={styles.input} placeholder="手机号" onChange={this.handleChangePhone}/>
                    </Box>
                    <Box>
                        <input className={styles.input} type="password" placeholder="密码"/>
                    </Box>
                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.okButton}
                            onClick={this.props.handleOnSave}
                        >
                            登录
                        </button>
                    </Box>
                    <p>{this.props.message}</p>
                </Box>
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
