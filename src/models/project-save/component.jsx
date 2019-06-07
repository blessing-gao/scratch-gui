import PropTypes from 'prop-types';
import React from 'react';
import Box from '../../components/box/box.jsx';
import Button from '../../components/button/button.jsx';
import styles from './style.css';
import classNames from 'classnames';

/**
 * 向服务端保存组件
 * @param props
 * @returns {*}
 * @constructor
 */

const ProjectSaveComponent = props => (
    <Box className={classNames(styles.menuBarItem)}>
        {props.canSave ? (
            <div className={classNames(styles.menuBarItem)}>
                <Button
                    className={classNames(styles.menuBarButton, styles.saveButton)}
                    onClick={props.handleSave}
                >
                    保存
                </Button>
            </div>
        ) : null}
        {props.canCopy ? (
            <div className={classNames(styles.menuBarItem)}>
                <Button
                    className={classNames(styles.menuBarButton, styles.saveButton)}
                    onClick={props.handleSaveCopy}
                >
                    另存
                </Button>
            </div>
        ) : null}
        {props.canSubmit ? (
            <div className={classNames(styles.menuBarItem)}>
                <Button
                    className={classNames(styles.menuBarButton, styles.saveButton)}
                    onClick={props.handleSubmit}
                >
                    提交
                </Button>
            </div>
        ) : null}
    </Box>
);

ProjectSaveComponent.propTypes = {
    canCopy: PropTypes.bool,
    canSave: PropTypes.bool,
    canSubmit: PropTypes.bool,
    handleSave: PropTypes.func,
    handleSaveCopy: PropTypes.func,
    handleSubmit: PropTypes.func
};

export default ProjectSaveComponent;
