import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import SaveModalComponent from '../../components/my/save-modal.jsx';
import {getQueryString} from '../../lib/request';
import request from '../../lib/request';
import {closeSaveModal} from '../../reducers/modals';

import {connect} from 'react-redux';
import {setWork} from '../../reducers/scratch';
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
            'onHandleCancel',
            'getType',
            'handleTagClick',
            'handleChangeName',
            'handleChangeDesc'
        ]);
        this.state = {
            id: '',
            workName: '',
            describe: '',
            shotSrc: '',
            isShow: false,
            tags: []
        };
    }

    getType (type){
        let work = this.props.work;
        request.default_request(request.GET, null, `/api/scratch/type?type=${type}&platFormId=${work.platFormId}&userToken=${work.userToken}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                let tags = [];
                result.result.map(tag => {
                    tags.push({id:tag.id,title:tag.name});
                });
                this.setState({tags:tags});
            }
        });
    }

    handleChangeName(event){
        this.setState({workName: event.target.value});
    }

    handleChangeDesc(event){
        this.setState({describe: event.target.value});
    }

    handleTagClick(tag){
        console.log(tag);
    }

    componentDidMount (){
        // todo: 更换分类,获取作品分类type为5
        this.getType(1);    // 获取作品分类
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
                desPlaceholder={'描述作品的操作说明'}
                title="保存作品"
                workName={this.state.workName}
                describe={this.state.describe}
                tags={this.state.tags}
                handleTagClick={this.handleTagClick}
                onChangeName={this.handleChangeName}
                onChangeDesc={this.handleChangeDesc}
            />);
    }
}

SaveModal.propTypes = {
    closeSaveModal: PropTypes.func,
    work: PropTypes.object
};
const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work
});

const mapDispatchToProps = dispatch => ({
    setWork:work => {
        dispatch(setWork(work));
    },
    closeSaveModal: () => {
        dispatch(closeSaveModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveModal);
