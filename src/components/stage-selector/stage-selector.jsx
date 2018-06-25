import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';
import CostumeCanvas from '../costume-canvas/costume-canvas.jsx';
import styles from './stage-selector.css';

import backdropIcon from '../action-menu/icon--backdrop.svg';
import fileUploadIcon from '../action-menu/icon--file-upload.svg';
import paintIcon from '../action-menu/icon--paint.svg';
import surpriseIcon from '../action-menu/icon--surprise.svg';
import searchIcon from '../action-menu/icon--search.svg';

const messages = {
    addBackdropFromLibrary: '选择背景',
    addBackdropFromPaint: '绘制',
    addBackdropFromSurprise: '随机',
    addBackdropFromFile: '上传背景'
};

const StageSelector = props => {
    const {
        backdropCount,
        fileInputRef,
        selected,
        raised,
        receivedBlocks,
        url,
        onBackdropFileUploadClick,
        onBackdropFileUpload,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onNewBackdropClick,
        onSurpriseBackdropClick,
        onEmptyBackdropClick,
        ...componentProps
    } = props;
    return (
        <Box
            className={classNames(styles.stageSelector, {
                [styles.isSelected]: selected,
                [styles.raised]: raised,
                [styles.receivedBlocks]: receivedBlocks
            })}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...componentProps}
        >
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    舞台
                </div>
            </div>
            {url ? (
                <CostumeCanvas
                    className={styles.costumeCanvas}
                    height={54}
                    url={url}
                    width={72}
                />
            ) : null}
            <div className={styles.label}>
                背景
            </div>
            <div className={styles.count}>{backdropCount}</div>
            <ActionMenu
                className={styles.addButton}
                img={backdropIcon}
                moreButtons={[
                    {
                        title: messages.addBackdropFromFile,
                        img: fileUploadIcon,
                        onClick: onBackdropFileUploadClick,
                        fileAccept: '.svg, .png, .jpg, .jpeg', // Bitmap coming soon
                        fileChange: onBackdropFileUpload,
                        fileInput: fileInputRef
                    }, {
                        title: messages.addBackdropFromSurprise,
                        img: surpriseIcon,
                        onClick: onSurpriseBackdropClick

                    }, {
                        title: messages.addBackdropFromPaint,
                        img: paintIcon,
                        onClick: onEmptyBackdropClick
                    }, {
                        title: messages.addBackdropFromLibrary,
                        img: searchIcon,
                        onClick: onNewBackdropClick
                    }
                ]}
                title={messages.addBackdropFromLibrary}
                onClick={onNewBackdropClick}
            />
        </Box>
    );
};

StageSelector.propTypes = {
    backdropCount: PropTypes.number.isRequired,
    fileInputRef: PropTypes.func,
    onBackdropFileUpload: PropTypes.func,
    onBackdropFileUploadClick: PropTypes.func,
    onClick: PropTypes.func,
    onEmptyBackdropClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onNewBackdropClick: PropTypes.func,
    onSurpriseBackdropClick: PropTypes.func,
    raised: PropTypes.bool.isRequired,
    receivedBlocks: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    url: PropTypes.string
};

export default StageSelector;
