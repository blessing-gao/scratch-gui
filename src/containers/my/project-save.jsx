import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ProjectSaveComponent from '../../components/my/project-save.jsx';
import request ,{getQueryString, getTargetId} from '../../lib/request';
import {getWork,setWork} from '../../reducers/scratch';
import {closeSaveModal} from "../../reducers/modals";
import {setConfirm,setConfirmBack} from '../../reducers/confirm';
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
            'handleChange'
        ]);
        this.state = {
            projectName: '',
            id: ''
        };
    }

    /**
     * 组件初始化
     * 通过输入链接获取作品信息
     */
    componentDidMount (){
        // todo 仅用于赋值参考
        // const work={
        //     id: '1234'
        // }
        // this.props.setWork(work);
        // console.log(this.props.work)

        // const id = getTargetId();
        // if (id !== null){
        //     request.default_request(request.GET, null, `/scratch/getProjectInfo?id=${id}`, result => {
        //         if (result.code !== request.NotFindError){
        //             this.props.setWork({
        //                 id: result.id,
        //                 workName: result.name,
        //                 projectName: result.name
        //             });
        //             console.log(this.props.work);
        //             this.setState({id: result.id, workName: result.name, projectName: result.name});
        //         }
        //     });
        // }
    }
    /**
     * 作品向服务端保存方法
     * @param notNewProject，true是保存，flase是另存
     */
    saveProject (notNewProject = true) {
        let work = this.props.work;
        let name = '';
        if (!work.name){
            alert('请先为作品命名!');
            return false;
        }else{
            name = work.name;
        }
        this.props.vm.saveProjectSb3().then(content => {
            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(content, name);
                return;
            }
            let saveData = {
                'file':content,
                'name':name,
                'platFormId1':work.platFormId,
                'userToken':work.userToken
            };
            if(work.id && notNewProject){
                saveData.scratchFile = JSON.stringify(work);
            }
            // let msg = {
            //     type: 2,
            //     message: '保存成功',
            //     show: true,
            //     selected: ''
            // };
            // this.props.setConfirm(msg);
            // this.timer = setInterval(()=>{
            //     let selected = this.props.confirm.selected;
            //     if(selected == 'yes'){
            //         clearInterval(this.timer);
            //     }else if(selected == 'no'){
            //         clearInterval(this.timer);
            //     }
            // },1000);
            // return false;
            request.file_request(request.POST, saveData, '/api/scratch/save', result => {
                if (result.code == 0 && result.result){
                    // 上传成功
                    let workData = this.props.work;
                    workData.id = result.result.id;
                    this.props.setWork(workData);
                    let msg = {
                        type: 1,
                        message: '保存成功',
                        status: 1,
                        timeout: 3000,
                        show: true
                    };
                    this.props.setConfirm(msg);
                }else{
                    let msg = {
                        type: 1,
                        message: '保存失败',
                        status: 2,
                        timeout: 3000,
                        show: true
                    };
                    this.props.setConfirm(msg);
                }
            });
        });
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
