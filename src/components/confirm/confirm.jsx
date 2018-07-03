import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import styles from './confirm.css';
import classNames from 'classnames';
import successSvg from './success.svg';
import errorSvg from './error.svg';

class ConfirmComponent extends React.Component {
    render(){
        return (
            <div>
                <a href="javascript:;">&times;</a>
                <div>
                    <img src={successSvg}/>
                    <p>保存成功保存成功保存成功保存成功</p>
                </div>
                <div>
                    <button>取消</button>
                    <button>确定</button>
                </div>
            </div>
        );
    }
}

ConfirmComponent.propTypes = {

};

export default ConfirmComponent;
