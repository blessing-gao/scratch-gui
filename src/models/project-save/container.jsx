import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ProjectSaveComponent from './component.jsx';
import {setProject} from '../../reducers/project-info';
import {openPublishModals} from '../../reducers/modals';
import {projectTitleInitialState} from '../../reducers/project-title';
import {version} from '../../lib/config';
import {saveProject} from '../../lib/service/project-api';
/**
 * 用于向服务器保存作品
 */

class ProjectSaveContainer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'onHandleSave',
            'onHandleSaveCopy',
            'uploadProject',
            'saveCover'
        ]);
    }

    onHandleSave () {
        const data = {
            id: this.props.project.id,
            name: this.props.projectFilename
        };
        if (this.props.project.id === '0'){
            data.version = version;
        }
        this.uploadProject(data);
    }

    onHandleSaveCopy () {
        const data = {
            id: 0,
            name: this.props.projectFilename,
            version: version
        };
        this.uploadProject(data);
    }

    uploadProject (data) {
        this.saveCover();
        this.props.saveProjectSb3().then(content => {
            data.file = content;
            // 可控制是否上传
            data.coverFile = sessionStorage.getItem('coverImg');
            saveProject(data).then(res => {
                console.log(res);
                this.props.onUpdateProject({
                    id: res.result.id
                });
            });
        });
    }

    saveCover (){
        const shotBtn = document.getElementById('shotBtn');
        shotBtn.click();
    }

    render () {
        return (
            <ProjectSaveComponent
                handleSave={this.onHandleSave}
                handleSaveCopy={this.onHandleSaveCopy}
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
    onClickSaveAsCopy: PropTypes.func,
    onOpenPublishModal: PropTypes.func,
    onUpdateProject: PropTypes.func,
    project: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    }),
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func
};

const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    project: state.scratchGui.projectInfo,
    projectFilename: getProjectFilename(state.scratchGui.projectInfo.name, projectTitleInitialState)
});

const mapDispatchToProps = dispatch => ({
    onOpenPublishModal: () => dispatch(openPublishModals()),
    onUpdateProject: project => dispatch(setProject(project))
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectSaveContainer);
