import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {defaultProjectId, getIsFetchingWithoutId, setNewProjectId, setProjectId} from '../reducers/project-state';

/* Higher Order Component to get the project id from location.hash
 * @param {React.Component} WrappedComponent: component to render
 * @returns {React.Component} component with hash parsing behavior
 */
export function getQueryString (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
}
const HashParserHOC = function (WrappedComponent) {
    class HashParserComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleHashChange'
            ]);
            this.state = {
                hideIntro: false
            };
        }
        componentDidMount () {
            window.addEventListener('hashchange', this.handleHashChange);
            this.handleHashChange();
        }
        componentDidUpdate (prevProps) {
            // if we are newly fetching a non-hash project...
            if (this.props.isFetchingWithoutId && !prevProps.isFetchingWithoutId) {
                // ...clear the hash from the url
                history.pushState('new-project', 'new-project',
                    window.location.pathname + window.location.search);
            }
        }
        componentWillUnmount () {
            window.removeEventListener('hashchange', this.handleHashChange);
        }

        handleHashChange () {
            // 控制获取作品ID的方式
            // const hashMatch = window.location.hash.match(/#(\d+)/);
            const projectId = getQueryString('id');
            const newId = getQueryString('newId');
            // 指定作品新保存的id
            if (newId === null) this.props.setNewProjectId(newId);
            const hashProjectId = projectId === null ? defaultProjectId : projectId;
            console.log('hash')
            this.props.setProjectId(hashProjectId.toString());
            if (hashProjectId !== defaultProjectId) {
                this.setState({hideIntro: true});
            }
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                isFetchingWithoutId: isFetchingWithoutIdProp,
                reduxProjectId,
                setProjectId: setProjectIdProp,
                /* eslint-enable no-unused-vars */
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    hideIntro={this.state.hideIntro}
                    {...componentProps}
                />
            );
        }
    }
    HashParserComponent.propTypes = {
        isFetchingWithoutId: PropTypes.bool,
        reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        setProjectId: PropTypes.func,
        setNewProjectId: PropTypes.func

    };
    const mapStateToProps = state => {
        const loadingState = state.scratchGui.projectState.loadingState;
        return {
            isFetchingWithoutId: getIsFetchingWithoutId(loadingState),
            reduxProjectId: state.scratchGui.projectState.projectId
        };
    };
    const mapDispatchToProps = dispatch => ({
        setProjectId: projectId => dispatch(setProjectId(projectId)),
        setNewProjectId: newProjectId => dispatch(setNewProjectId(newProjectId))
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(HashParserComponent);
};

export {
    HashParserHOC as default
};
