import PropTypes from 'prop-types';
import React from 'react';
import Box from '../../components/box/box.jsx';
import Button from '../../components/button/button.jsx';
import styles from './style.css';
import classNames from 'classnames';

/**
 * 向服务端保存组件
 * // todo 全局控制上传中的冻结状态
 * @param props
 * @returns {*}
 * @constructor
 */

const ProjectSaveComponent = props => (
    <Box className={classNames(styles.menuBarItem)}>
        <div className={classNames(styles.menuBarItem)}>
            <Button
                className={classNames(styles.menuBarButton, styles.saveButton)}
                onClick={props.handleSave}
            >
                保存
            </Button>
        </div>
        <div className={classNames(styles.menuBarItem)}>
            <Button
                className={classNames(styles.menuBarButton, styles.saveButton)}
                onClick={props.handleSaveCopy}
            >
                另存
            </Button>
        </div>
    </Box>
);

ProjectSaveComponent.propTypes = {
    handleSave: PropTypes.func,
    handleSaveCopy: PropTypes.func
};
ProjectSaveComponent.defaultProps = {
    canSave: true
};

export default ProjectSaveComponent;
