import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import analytics from '../lib/analytics';
import log from '../lib/log';

import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';

import {setWork} from '../reducers/scratch';
/**
 * Project loader component passes a file input, load handler and props to its child.
 * It expects this child to be a function with the signature
 *     function (renderFileInput, loadProject, props) {}
 * The component can then be used to attach project loading functionality
 * to any other component:
 *
 * <ProjectLoader>{(renderFileInput, loadProject, props) => (
 *     <MyCoolComponent
 *         onClick={loadProject}
 *         {...props}
 *     >
 *         {renderFileInput()}
 *     </MyCoolComponent>
 * )}</ProjectLoader>
 */

const messages = defineMessages({
    loadError: {
        id: 'gui.projectLoader.loadError',
        defaultMessage: 'The project file that was selected failed to load.',
        description: 'An error that displays when a local project file fails to load.'
    }
});

class ProjectLoader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderFileInput',
            'setFileInput',
            'handleChange',
            'handleClick'
        ]);
    }
    handleChange (e) {
        // Remove the hash if any (without triggering a hash change event or a reload)
        history.replaceState({}, document.title, '.');
        const reader = new FileReader();
        const thisFileInput = e.target;
        reader.onload = () => this.props.vm.loadProject(reader.result)
            .then(() => {
                analytics.event({
                    category: 'project',
                    action: 'Import Project File',
                    nonInteraction: true
                });
                this.props.closeLoadingState();
                // Reset the file input after project is loaded
                // This is necessary in case the user wants to reload a project
                thisFileInput.value = null;
                const work = this.props.work;
                const newWork = {
                    userToken: work.userToken,
                    platFormId: work.platFormId,
                    userId: work.userId,
                    nickname: work.nickname,
                    picUrl: work.picUrl
                };
                this.props.setWork(newWork);
            })
            .catch(error => {
                log.warn(error);
                alert(this.props.intl.formatMessage(messages.loadError)); // eslint-disable-line no-alert
                this.props.closeLoadingState();
                // Reset the file input after project is loaded
                // This is necessary in case the user wants to reload a project
                thisFileInput.value = null;
            });
        if (thisFileInput.files) { // Don't attempt to load if no file was selected
            this.props.openLoadingState();
            reader.readAsArrayBuffer(thisFileInput.files[0]);
        }
    }
    handleClick () {
        this.fileInput.click();
    }
    setFileInput (input) {
        this.fileInput = input;
    }
    renderFileInput () {
        return (
            <input
                accept=".sb2,.sb3,.my"
                ref={this.setFileInput}
                style={{display: 'none'}}
                type="file"
                onChange={this.handleChange}
            />
        );
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            children,
            closeLoadingState,
            openLoadingState,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.renderFileInput, this.handleClick, props);
    }
}

ProjectLoader.propTypes = {
    children: PropTypes.func,
    closeLoadingState: PropTypes.func,
    intl: intlShape.isRequired,
    openLoadingState: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    }),
    work: PropTypes.object
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    work: state.scratchGui.scratch.work
});

const mapDispatchToProps = dispatch => ({
    closeLoadingState: () => dispatch(closeLoadingProject()),
    openLoadingState: () => dispatch(openLoadingProject()),
    setWork: work => dispatch(setWork(work))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ProjectLoader));
