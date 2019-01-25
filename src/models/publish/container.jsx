import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import PublishComponent from './component.jsx';
import {getProjectTags, saveProject} from '../../lib/service/project-api';
import {closePublishModal} from '../../reducers/modals';
import {version} from '../../lib/config';
import {setProject} from '../../reducers/project-info';
import {projectTitleInitialState} from '../../reducers/project-title';

const PROJECT_TYPE = 5;
class PublishContainer extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveCover',
            'onHandlePublish',
            'onHandleName',
            'onHandleDesc'
        ]);
        this.saveCover()
        this.state = {
            name: this.props.projectFilename,
            description: this.props.project.description || '',
            tags: []
        };
    }

    componentDidMount () {
        getProjectTags(PROJECT_TYPE).then(data => {
            if (data.code === 0 && data.result) {
                const tags = [];
                data.result.map(tag => {
                    tags.push({id: tag.typeId, title: tag.name});
                    return tag;
                });
                if (tags){
                    this.setState({tags: tags});
                }

            }
        });
    }

    onHandleName (event){
        this.setState({
            name: event.target.value
        });
    }

    onHandleDesc (event){
        this.setState({
            description: event.target.value
        });
    }

    onHandlePublish () {
        const data = {
            id: this.props.project.id,
            name: this.state.name,
            isRelease: '1',
            remarks: this.state.description
        };
        if (this.props.project.id === '0'){
            data.version = version;
        }
        console.log(data)
        this.props.saveProjectSb3().then(content => {
            data.file = content;
            // 可控制是否上传
            data.coverFile = sessionStorage.getItem('coverImg');
            saveProject(data).then(res => {
                console.log(res);
                this.props.onUpdateProject({
                    id: res.result.id,
                    name: this.state.name,
                    remarks: this.state.description
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
            <PublishComponent
                coverSrc={sessionStorage.getItem('coverImg')}
                handleDesc={this.onHandleDesc}
                handleName={this.onHandleName}
                handlePublish={this.onHandlePublish}
                projectDesc={this.state.description}
                projectName={this.state.name}
                tags={this.state.tags}
                onHandleCancel={this.props.onClosePublishModal}
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

PublishContainer.propTypes = {
    onClosePublishModal: PropTypes.func,
    onUpdateProject: PropTypes.func,
    project: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string
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
    onClosePublishModal: () => dispatch(closePublishModal()),
    onUpdateProject: project => dispatch(setProject(project))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishContainer);
