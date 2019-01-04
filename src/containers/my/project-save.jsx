import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ProjectSaveComponent from '../../components/my/project-save.jsx';
import request ,{getQueryString, getTargetId} from '../../lib/request';
import {getWork,setWork} from '../../reducers/scratch';
import {closeSaveModal} from "../../reducers/modals";
import {setConfirm,setConfirmBack} from '../../reducers/confirm';
import fireKeyEvent from '../../lib/key-map';
import Cookies from 'universal-cookie';
/**
 * 本组件用于向服务器保存作品
 * Project saver component passes a saveProject function to its child.
 * It expects this child to be a function with the signature
 *     function (saveProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <ProjectSaver>{(saveProject, props) => (
 *     <MyCoolComponent
 *         onClick={saveProject}
 *         {...props}
 *     />
 * )}</ProjectSaver>
 */

class ProjectSave extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveProject',
            'handleChange',
            'saveCover',
            'resetLoading',
            'changeLoadStatus',
            'loadBack'
        ]);
        this.state = {
            projectName: '',
            id: '',
            iDisable: false,
            cover: ''
        };
    }

    /**
     * 组件初始化
     * 通过输入链接获取作品信息
     */
    componentDidMount (){

    }

    componentWillUnmount() {
        if(this.timer){
            clearInterval(this.timer);
        }
    }

    resetLoading(iFlag){
        let work = {...this.props.work};
        work.isLoading = !!iFlag;   // 是否正在上传
        work.loadStatus = 0;   // 上传的状态,0:预处理,1:提交中,2:解析中
        this.props.setWork(work);
    }

    changeLoadStatus(status){
        let work = {...this.props.work};
        work.loadStatus = status;
        this.props.setWork(work);
    }

    loadBack(iFlag){
        let msg = {
            type: 1,
            message: iFlag ? '上传成功' : '上传失败,请稍后再试',
            status: iFlag ? 1 : 2,
            timeout: 1500,
            show: true
        };
        this.props.setConfirm(msg);
    }

    /**
     * 作品向服务端保存方法
     * @param notNewProject，true是保存，flase是另存
     */
    saveProject (notNewProject = true) {
        if(!this.props.checkUser()) return;
        let work = {...this.props.work};
        let name = '';
        if (!work.name){
            alert('请先为作品命名!');
            return false;
        }else{
            name = work.name;
        }
        this.resetLoading(true);
        this.setState({iDisable: true});
        this.props.vm.saveProjectSb3().then(content => {
            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(content, name);
                return;
            }
            let saveData = {
                'file':content,
                'name':name,
                'nickname':work.nickname,
                "userId":work.userId,
                'cover' :sessionStorage.getItem('coverImg'),
                'version': '2.0'
            };
            if(work.id && notNewProject){
                saveData.id = work.id;
            }
            request.file_request(request.POST, saveData, '/api/scratch/saveWork', result => {
                let workData = {...this.props.work};
                if (result.code == 0 && result.result){
                    // 上传成功
                    workData.id = result.result.id;
                    workData.loadStatus = 1;    // 更改loading状态为提交中
                    this.props.setWork(workData);
                    // 开始轮询,检测是否解析成功
                    this.timer = setInterval(()=>{
                        request.default_request(request.GET, null, `/api/scratch/judgeWorkMemoryStatus?scratchId=${result.result.id}`, result => {
                            let status = result.msg;
                            if(status == "0") return;
                            this.setState({iDisable:false});
                            if(status == "1"){
                                // 成功
                                console.log("成功");
                                this.changeLoadStatus(2);
                                this.loadBack(true);
                                setTimeout(()=>this.resetLoading(false),500);
                            }else if(status == "-1"){
                                // 失败
                                console.log("失败");
                                this.resetLoading(false);
                                this.loadBack(false);
                            }
                            clearInterval(this.timer);
                        });
                    },1000);
                }else{
                   // 上传失败
                    // 更改状态为失败,延时显示2s后关闭,提示上传失败,请重新上传
                    this.setState({iDisable:false});
                    this.resetLoading(false);
                    this.loadBack(false);
                }
                this.props.setWork(workData);
            });
        });
    }

    saveCover(){
        const shotBtn = document.getElementById('shotBtn');
        fireKeyEvent(shotBtn, 'keydown', 16);
    }

    handleChange (event) {
        this.setState({projectName: event.target.value});
        let workData = this.props.work;
        workData.name = event.target.value;
        this.props.setWork(workData);
    }

    render () {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            work1,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        // return this.props.children(this.saveProject, props);
        return (
            <ProjectSaveComponent
                projectName={this.props.work.name}
                onChange={this.handleChange}
                save={this.saveProject.bind(this,true)}
                saveAs={this.saveProject.bind(this,false)}
                iDisable={this.state.iDisable}
                handleHover={this.saveCover}
            />);
    }

}

ProjectSave.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    }),
    setWork: PropTypes.func,
    work: PropTypes.object,
    confirm: PropTypes.object
};

const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work,
    vm: state.scratchGui.vm,
    confirm: state.scratchGui.confirm.confirmConf
});

const mapDispatchToProps = dispatch => ({
    setWork:(work) => {
        dispatch(setWork(work));
    },
    setConfirm:(confirm) => {dispatch(setConfirm(confirm));},
    setConfirmBack:() => {dispatch(setConfirmBack());}
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectSave);
