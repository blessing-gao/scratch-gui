import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import styles from './project-save.css';
import classNames from 'classnames';
import Confirm from '../confirm/confirm.jsx'

const ProjectSaveComponent = props => {
    const {
        onChange,
        projectName,
        save,
        saveAs,
        iDisable,
        handleHover
    } = props;

    return (
        <Box className={classNames(styles.menuBarItem)}>
            <div className={classNames(styles.menuBarItem)}>
                <input
                    className={classNames(styles.titleField)}
                    placeholder="未命名"
                    value={projectName}
                    onChange={onChange}
                />
            </div>
            <div className={classNames(styles.menuBarItem)}>
                <Button className={classNames(styles.shareButton)} disabled={iDisable} onClick={save} onMouseOver={handleHover}>
                    保存
                </Button>
            </div>
            <div className={classNames(styles.menuBarItem)}>
                <Button className={classNames(styles.shareButton)} disabled={iDisable} onClick={saveAs} onMouseOver={handleHover}>
                    另存
                </Button>
            </div>
        </Box>
    );

};

ProjectSaveComponent.propTypes = {
    projectName: PropTypes.string,
    onChange: PropTypes.func.isRequired
};
ProjectSaveComponent.defaultProps = {
    projectName: ''
};

export default ProjectSaveComponent;
