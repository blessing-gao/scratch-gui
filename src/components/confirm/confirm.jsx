import PropTypes from 'prop-types';
import React from 'react';
import styles from './confirm.css';
import classNames from 'classnames';
import successSvg from './success.svg';
import errorSvg from './error.svg';

class ConfirmComponent extends React.Component {
    render(){
        return (
            <div className={styles.confirmBox}>
                {this.props.type == 1 ?
                    (<div className={classNames(
                            styles.confirmInner,
                            styles.confirmMsg)}>
                        <div>
                            <img 
                                src={this.props.status == 1 ? successSvg : errorSvg} 
                                className={styles.iconImg}
                            />
                            <p className={classNames(styles.msgs,styles.msgH)}>
                                {this.props.message}
                            </p>
                        </div>
                    </div>) : this.props.type == 2 ?
                    (<div className={styles.confirmInner}>
                        <a href="javascript:;"
                           className={styles.closeBtn}
                           onClick={this.props.handleCancel}>&times;</a>
                        <div>
                            <p className={classNames(styles.msgs,styles.leftNo)}>
                                {this.props.message}
                            </p>
                        </div>
                        <div className={styles.textR}>
                            <button 
                                className={classNames(styles.confirmBtn,styles.deleteBtn)}
                                onClick={this.props.handleCancel}
                            >取消</button>
                            <button
                                className={classNames(styles.confirmBtn,styles.doBtn)}
                                onClick={this.props.handleSure}
                            >确定</button>
                        </div>
                    </div>) : ''
                }
            </div>
        );
    }
}

ConfirmComponent.propTypes = {
    type: PropTypes.number,
    message: PropTypes.string,
    status: PropTypes.number,
    timeout: PropTypes.number,
    handleCancel: PropTypes.func,
    handleSure: PropTypes.func
};

export default ConfirmComponent;
