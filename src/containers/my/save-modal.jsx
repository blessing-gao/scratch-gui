import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import SaveModalComponent from '../../components/my/save-modal.jsx';
import {getQueryString} from '../../lib/request';
import request from '../../lib/request';
import {closeSaveModal} from '../../reducers/modals';

import {connect} from 'react-redux';
// import Base64 from 'crypto-js/enc-base64';
// import UTF_8 from 'crypto-js/enc-utf8';
// import fireKeyEvent from '../lib/key-map';

class SaveModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'componentDidMount',
            'handleOnSave',
            'handleChange',
            'onHandleCancel'
        ]);
        this.state = {
            id: '',
            workName: '',
            shotSrc: '',
            isShow: false
        };
    }
    componentDidMount (){

        // 获取作品数据
        // const id = getQueryString('projectId');
        // if (id !== null && typeof id !== 'undefined' && id !== ''){
        //     request.default_request(request.GET, null, `/internalapi/project/${id}/getInfo/`, result => {
        //         if (result.code !== request.NotFindError){
        //             this.setState({id: result.value.id, workName: result.value.name});
        //         }
        //     });
        // }
    }

    handleOnSave (type = true){
        console.log("save点击")

    }
    handleChange (event) {
        this.setState({workName: event.target.value});
    }
    onHandleCancel () {
        this.props.closeSaveModal();
    }
    render () {
        /* eslint-disable no-unused-vars */
        return (
            <SaveModalComponent
                handleCancel={this.onHandleCancel}
                label={'作品名称'}
                placeholder={'输入作品名称'}
                title="保存作品"
                workName={this.state.workName}
            />);
    }
}

SaveModal.propTypes = {
    closeSaveModal: PropTypes.func,

};
const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({

    closeSaveModal: () => {
        dispatch(closeSaveModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveModal);
