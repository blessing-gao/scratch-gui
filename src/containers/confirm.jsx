import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {setConfirmBack,setConfirm} from '../reducers/confirm';
import request from '../lib/request';
import ConfirmComponent from '../components/confirm/confirm.jsx';

class ConfirmMsg extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this,[
            'handleCancel',
            'handleSure'
        ]);
    }

    handleCancel(){
        // 点击关闭
        let confirm = JSON.parse(JSON.stringify(this.props.confirmConf));
        confirm.show = false;
        confirm.selected = "no";
        this.props.setConfirm(confirm);
    }

    handleSure(){
        // 点击确定时
        // this.props.setConfirmBack(this.props.handleSure);
        let confirm = JSON.parse(JSON.stringify(this.props.confirmConf));
        confirm.show = false;
        confirm.selected = "yes";
        this.props.setConfirm(confirm);
    }

    componentDidMount(){
        // 若type为1则添加倒计时关闭计数窗口
        let confirm = this.props.confirmConf;
        if(this.props.type == 1){
            this.timer = setTimeout(
                () => { this.handleCancel();}, confirm.timeout);
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render (){
        return (
            <ConfirmComponent
                type={this.props.type}
                message={this.props.message}
                status={this.props.status}
                timeout={this.props.timeout}
                handleCancel={this.handleCancel}
                handleSure={this.handleSure}
            />
        );
    }
}

ConfirmMsg.propTypes = {
    type: PropTypes.number,
    message: PropTypes.string,
    status: PropTypes.number,
    timeout: PropTypes.number,
    handleSure: PropTypes.func,

    confirmConf: PropTypes.object,
    setConfirmBack: PropTypes.func,
    setConfirm: PropTypes.func
};

const mapStateToProps = state => ({
    confirmConf: state.scratchGui.confirm.confirmConf
});

const mapDispatchToProps = dispatch => ({
    setConfirm:(confirm) => {
        dispatch(setConfirm(confirm));
    },
    setConfirmBack:(func) => {
        dispatch(setConfirmBack(func));
    }
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfirmMsg);
