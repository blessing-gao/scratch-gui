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

const ProjectSaveComponent = props => {


    return (
        <Box className={classNames(styles.menuBarItem)}>
            <div className={classNames(styles.menuBarItem)}>
                <Button
                    className={classNames(styles.menuBarButton, styles.saveButton)}
                    onClick={props.onClickSave}
                >
                    保存
                </Button>
            </div>
            <div className={classNames(styles.menuBarItem)}>
                <Button
                    className={classNames(styles.menuBarButton, styles.saveButton)}
                    onClick={props.onClickSaveAsCopy}
                >
                    另存
                </Button>
            </div>
            <div className={classNames(styles.menuBarItem)}>
                <Button
                    className={classNames(styles.menuBarButton, styles.shareButton)}
                    // onClick={this.handleRelease}
                >
                    作品发布
                </Button>
            </div>
        </Box>
    );

};

ProjectSaveComponent.propTypes = {
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func

};
ProjectSaveComponent.defaultProps = {
    canSave: true
};

export default ProjectSaveComponent;
