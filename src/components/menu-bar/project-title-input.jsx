import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Input from '../forms/input.jsx';
const BufferedInput = BufferedInputHOC(Input);

import styles from './project-title-input.css';

class ProjectTitleInput extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUpdateProjectTitle'
        ]);
    }
    // call onUpdateProjectTitle if it is defined (only defined when gui
    // is used within scratch-www)
    handleUpdateProjectTitle (newTitle) {
        if (this.props.onUpdateProjectTitle) {
            this.props.onUpdateProjectTitle(newTitle);
        }
    }
    render () {
        return (
            <BufferedInput
                className={classNames(styles.titleField, this.props.className)}
                maxLength="100"
                placeholder={'在此填写项目标题'}
                tabIndex="0"
                type="text"
                value={this.props.project.name}
                onSubmit={this.handleUpdateProjectTitle}
            />
        );
    }
}

ProjectTitleInput.propTypes = {
    className: PropTypes.string,
    onUpdateProjectTitle: PropTypes.func,
    project: PropTypes.shape({
        name: PropTypes.string
    })
};

const mapStateToProps = state => ({
    project: state.scratchGui.projectInfo
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectTitleInput);
