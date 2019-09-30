import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {
    defaultProjectId,
    getIsFetchingWithId,
    LoadingStates,
    onFetchedProjectData,
    projectError,
    setHeaderCover,
    setProjectCanCopy,
    setProjectCanSave,
    setProjectId,
    setUsername
} from '../reducers/project-state';

import log from './log';
import storage from './storage';
import {ASSET_HOST, PROJECT_HOST} from '../config';
import {getCurrentUser, getProjectInfo} from './service/project-api';
import {setProjectTitle} from '../reducers/project-title';

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectFetcherHOC = function (WrappedComponent) {
    class ProjectFetcherComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'fetchProject',
                'fetchUser'
            ]);
            storage.setProjectHost(props.projectHost);
            storage.setAssetHost(props.assetHost);
            storage.setTranslatorFunction(props.intl.formatMessage);
            // props.projectId might be unset, in which case we use our default;
            // or it may be set by an even higher HOC, and passed to us.
            // Either way, we now know what the initial projectId should be, so
            // set it in the redux store.
            if (
                props.projectId !== '' &&
                props.projectId !== null &&
                typeof props.projectId !== 'undefined'
            ) {
                this.props.setProjectId(props.projectId.toString());
            }
        }
        componentDidUpdate (prevProps) {
            if (prevProps.projectHost !== this.props.projectHost) {
                storage.setProjectHost(this.props.projectHost);
            }
            if (prevProps.assetHost !== this.props.assetHost) {
                storage.setAssetHost(this.props.assetHost);
            }
            if (this.props.isFetchingWithId && !prevProps.isFetchingWithId) {
                this.fetchProject(this.props.reduxProjectId, this.props.loadingState);
            }
            this.fetchUser();
        }

        fetchUser() {
            getCurrentUser().then(user => {
                if (user !== null && typeof user !== 'undefined') {
                    if (user.username && user.username !== null && user.username !== '') {
                        this.props.setUsername(user.username);
                    }

                    if (user.head && user.head !== null && user.head !== '') {
                        this.props.setHeaderCover(user.head);
                    }
                }
                console.log(`当前登录用户：${user}`);
            })
                .catch(error => {
                    throw error;
                });
        }

        fetchProject (projectId, loadingState) {
            if (projectId !== defaultProjectId) {
                getProjectInfo(projectId).then(contents => {
                    if (contents) {
                        if (contents.canCopy) this.props.setProjectCanCopy(contents.canCopy);
                        if (contents.canSave) this.props.setProjectCanSave(contents.canSave);
                        if (contents.canSubmit) this.props.setProjectCanSave(contents.canSubmit);
                        this.props.onUpdateProjectTitle(contents.programname);
                    }
                })
                    .catch(error => {
                        throw error;
                    });
            }
            return storage
                .load(storage.AssetType.Project, projectId, storage.DataFormat.JSON)
                .then(projectAsset => {
                    if (projectAsset) {
                        this.props.onFetchedProjectData(projectAsset.data, loadingState);
                    }
                })
                .then(() => {
                    console.log('作品加载成功');
                })
                .catch(err => {
                    this.props.onError(err);
                    log.error(err);
                });
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                assetHost,
                intl,
                loadingState,
                onError: onErrorProp,
                onFetchedProjectData: onFetchedProjectDataProp,
                projectHost,
                projectId,
                reduxProjectId,
                setProjectId: setProjectIdProp,
                /* eslint-enable no-unused-vars */
                isFetchingWithId: isFetchingWithIdProp,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    fetchingProject={isFetchingWithIdProp}
                    {...componentProps}
                />
            );
        }
    }
    ProjectFetcherComponent.propTypes = {
        assetHost: PropTypes.string,
        canSave: PropTypes.bool,
        intl: intlShape.isRequired,
        isFetchingWithId: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onError: PropTypes.func,
        onFetchedProjectData: PropTypes.func,
        onUpdateProjectTitle: PropTypes.func,
        projectHost: PropTypes.string,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        setHeaderCover: PropTypes.func,
        setProjectCanCopy: PropTypes.func,
        setProjectCanSave: PropTypes.func,
        setProjectId: PropTypes.func,
        setUsername: PropTypes.func
    };
    ProjectFetcherComponent.defaultProps = {
        assetHost: `${ASSET_HOST}`,
        projectHost: `${PROJECT_HOST}`
    };

    const mapStateToProps = state => ({
        isFetchingWithId: getIsFetchingWithId(state.scratchGui.projectState.loadingState),
        loadingState: state.scratchGui.projectState.loadingState,
        reduxProjectId: state.scratchGui.projectState.projectId
    });
    const mapDispatchToProps = dispatch => ({
        onError: error => dispatch(projectError(error)),
        onFetchedProjectData: (projectData, loadingState) =>
            dispatch(onFetchedProjectData(projectData, loadingState)),
        onUpdateProjectTitle: title => dispatch(setProjectTitle(title)),
        setProjectId: projectId => dispatch(setProjectId(projectId)),
        setProjectCanSave: flag => dispatch(setProjectCanSave(flag)),
        setProjectCanCopy: flag => dispatch(setProjectCanCopy(flag)),
        setUsername: username => dispatch(setUsername(username)),
        setHeaderCover: cover => dispatch(setHeaderCover(cover))
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(ProjectFetcherComponent));
};

export {
    ProjectFetcherHOC as default
};
