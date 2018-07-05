import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import SaveModalComponent from '../../components/my/save-modal.jsx';
import {getQueryString} from '../../lib/request';
import request from '../../lib/request';
import {closeSaveModal} from '../../reducers/modals';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {setWork} from '../../reducers/scratch';
import {setConfirm,setConfirmBack} from '../../reducers/confirm';
import fireKeyEvent from '../../lib/key-map';
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
            selectedTag: '',
            shotSrc: '',
            coverSrc: '',
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
        this.setState({selectedTag: tag});
    }

    componentDidMount (){
        // todo: 更换分类,获取作品分类type为5
        this.getType(1);    // 获取作品分类
        this.setState({workName: this.props.work.name || ''});
        const shotBtn = document.getElementById('shotBtn');
        fireKeyEvent(shotBtn, 'keydown', 16);
        this.state.coverSrc = sessionStorage.getItem('coverImg');
    }

    handleOnSave (){
        let work = JSON.parse(JSON.stringify(this.props.work));
        this.props.vm.saveProjectSb3().then(content => {
            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(content, this.state.name);
                return;
            }
            let saveData = {
                'file':content,
                'platFormId1':work.platFormId,
                'userToken':work.userToken
            };
            for(let x in work){
                saveData[x] = work[x];
            }
            saveData.name = this.state.workName;
            saveData.remarks = this.state.describe;
            saveData.type = this.state.selectedTag;
            saveData.cover = sessionStorage.getItem('coverImg');
            saveData.release = 1;
            request.file_request(request.POST, saveData, '/api/scratch/save', result => {
                if (result.code == 0 && result.result){
                    // 上传成功
                    let workData = JSON.parse(JSON.stringify(this.props.work));
                    for(let x in result.result){
                        workData[x] = work[x];
                    }
                    this.props.setWork(workData);
                    let msg = {
                        type: 1,
                        message: '发布成功',
                        status: 1,
                        timeout: 3000,
                        show: true
                    };
                    this.props.setConfirm(msg);
                }else{
                    let msg = {
                        type: 1,
                        message: '发布失败',
                        status: 2,
                        timeout: 3000,
                        show: true
                    };
                    this.props.setConfirm(msg);
                }
                this.onHandleCancel();
            });
        });
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
                coverSrc={this.state.coverSrc}
                title="保存作品"
                workName={this.state.workName}
                describe={this.state.describe}
                tags={this.state.tags}
                handleTagClick={this.handleTagClick}
                onChangeName={this.handleChangeName}
                onChangeDesc={this.handleChangeDesc}
                handleOnSave={this.handleOnSave}
            />);
    }
}

SaveModal.propTypes = {
    closeSaveModal: PropTypes.func,
    work: PropTypes.object,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    })
};
const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    setWork:work => {
        dispatch(setWork(work));
    },
    closeSaveModal: () => {
        dispatch(closeSaveModal());
    },
    setConfirm:(confirm) => {dispatch(setConfirm(confirm));}
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveModal);
