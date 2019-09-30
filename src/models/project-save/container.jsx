import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ProjectSaveComponent from './component.jsx';
import {projectTitleInitialState} from '../../reducers/project-title';
import {saveProject} from '../../lib/service/project-api';
import {setProjectId} from '../../reducers/project-state';

/**
 * 用于向服务器保存作品
 */
class ProjectSaveContainer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'onHandleSave',
            'onHandleSaveCopy',
            'onHandleSubmit',
            'uploadProject'
        ]);
    }

    onHandleSave () {
        const data = {
            id: this.props.newProjectId !== null ? this.props.newProjectId : this.props.projectId,
            name: this.props.projectTitle,
            submit: false
        };
        this.uploadProject(data);
    }

    onHandleSaveCopy () {
        const data = {
            id: 0,
            name: this.props.projectTitle,
            submit: false
        };
        this.uploadProject(data);
    }

    onHandleSubmit() {
        const data = {
            id: this.props.newProjectId !== null ? this.props.newProjectId : this.props.projectId,
            name: this.props.projectTitle,
            submit: true
        };
        this.uploadProject(data);
    }

    uploadProject (data) {
        // 如果封面不存在则触发截图
        const cover = sessionStorage.getItem('cover');
        if (cover === null || cover === '') {
            this.saveCover();
        }
        this.props.saveProjectSb3().then(content => {
            data.file = content;
            if (cover === null || cover === '') {
                data.cover = sessionStorage.getItem('cover');
            } else {
                data.cover = cover;
            }

            // 可控制是否上传
            saveProject(data).then(res => {
                // 获取生成的作品id
                this.props.setProjectId(res.id);
            });
        });
    }

    saveCover() {
        const shotBtn = document.getElementById('ScreenShotButton');
        shotBtn.click();
    }

    render () {
        return (
            <ProjectSaveComponent
                handleSave={this.onHandleSave}
                handleSaveCopy={this.onHandleSaveCopy}
                handleSubmit={this.onHandleSubmit}
                {...this.props}
            />);
    }

}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}`;
};

ProjectSaveContainer.propTypes = {
    canCopy: PropTypes.bool,
    canSave: PropTypes.bool,
    canSubmit: PropTypes.bool,
    newProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClickSaveAsCopy: PropTypes.func,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    projectTitle: PropTypes.string,
    saveProjectSb3: PropTypes.func,
    setProjectId: PropTypes.func
};

const mapStateToProps = state => ({
    projectId: state.scratchGui.projectState.projectId,
    newProjectId: state.scratchGui.projectState.newProjectId,
    canSave: state.scratchGui.projectState.canSave,
    canCopy: state.scratchGui.projectState.canCopy,
    canSubmit: state.scratchGui.projectState.canSubmit,
    projectTitle: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState),
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm)
});

const mapDispatchToProps = dispatch => ({
    setProjectId: projectId => dispatch(setProjectId(projectId))
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectSaveContainer);
