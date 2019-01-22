import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ProjectSaveComponent from './component.jsx';
import {
    updateProject,
    saveProjectAsCopy
} from '../../reducers/project-state';
import {openPublishModals} from '../../reducers/modals';

/**
 * 用于向服务器保存作品
 */

class ProjectSaveContainer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
        ]);
        this.state = {
        };
    }

    render () {
        return (
            <ProjectSaveComponent
                {...this.props}
            />);
    }

}

ProjectSaveContainer.propTypes = {
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onOpenPublishModal: PropTypes.func
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onClickSave: () => {
        console.log('onClickSave')
        dispatch(updateProject());
    },
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onOpenPublishModal: () => dispatch(openPublishModals())
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectSaveContainer);
