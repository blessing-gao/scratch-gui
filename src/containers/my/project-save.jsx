import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ProjectSaveComponent from '../../components/my/project-save.jsx';
import request ,{getQueryString, getTargetId} from '../../lib/request';
import {getWork,setWork} from '../../reducers/scratch';
import {closeSaveModal} from "../../reducers/modals";
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

        const id = getTargetId();
        if (id !== null){
            request.default_request(request.GET, null, `/scratch/getProjectInfo?id=${id}`, result => {
                if (result.code !== request.NotFindError){
                    this.props.setWork({
                        id: result.id,
                        workName: result.name,
                        projectName: result.name
                    });
                    console.log(this.props.work);
                    this.setState({id: result.id, workName: result.name, projectName: result.name});
                }
            });
        }
    }
    /**
     * 作品向服务端保存方法
     * @param isNewProject，true是保存，flase是另存
     */
    saveProject (isNewProject = true) {
        let filename = '';
        if (this.state.projectName === ''){
            alert('保存失败,请先为作品命名!');
            return false;
        }else{
            filename = this.state.projectName;
        }
        this.props.vm.saveProjectSb3().then(content => {
            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(content, filename);
                return;
            }
            let saveData = {
                'file':content,
                'name':filename,
                'platFormId':'1',
                'userToken':'1'
            };
            // let saveData = {
            //     'file':content
            // };
            const id = getTargetId();
            saveData.id = id ? id : '0';
            request.file_request(request.POST, saveData, '/api/save1', result => {
                if (result.code == 1){
                    // 上传成功
                }
            });
        });
        // let filename = '';
        // if (this.state.projectName === ''){
        //     const date = new Date();
        //     const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
        //     filename = `未命名作品-${timestamp}.my`;
        // }
        // const saveLink = document.createElement('a');
        // document.body.appendChild(saveLink);
        //
        // this.props.vm.saveProjectSb3().then(content => {
        //     // Use special ms version if available to get it working on Edge.
        //     if (navigator.msSaveOrOpenBlob) {
        //         navigator.msSaveOrOpenBlob(content, filename);
        //         return;
        //     }
        //
        //     const url = window.URL.createObjectURL(content);
        //     saveLink.href = url;
        //     saveLink.download = filename;
        //     saveLink.click();
        //     window.URL.revokeObjectURL(url);
        //     document.body.removeChild(saveLink);
        // });
    }

    handleChange (event) {
        this.setState({projectName: event.target.value});
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
                projectName={this.state.projectName}
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
    getWork: PropTypes.func,
    work: PropTypes.object
};

const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    setWork:work => {
        dispatch(setWork(work));
    },
    getWork:() => {
        dispatch(getWork());
    },
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectSave);
