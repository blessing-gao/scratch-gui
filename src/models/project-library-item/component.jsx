import PropTypes from 'prop-types';
import React from 'react';
import Box from '../../components/box/box.jsx';
import styles from './style.css';
import classNames from 'classnames';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import shareIcon from '../../lib/assets/project-library/share-icon.png';

const qrStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '1.5rem 2rem',
        borderRadius: '.5rem'
    }
};

const ProjectLibraryItemComponent = props => (
    <Box>
        <Box
            className={styles.libraryItem}
            onMouseEnter={props.onHandleMouseEnter}
            onMouseLeave={props.onHandleMouseLeave}
        >
            {/* Layers of wrapping is to prevent layout thrashing on animation */}
            <Box
                className={styles.libraryItemImageContainerWrapper}
                onClick={props.onHandleEditClick}
            >
                <img
                    className={styles.libraryItemImage}
                    src={props.iconURL}
                />
            </Box>
            <Box className={styles.libraryItemContainer}>
                <Box className={classNames(styles.libraryItemContent, styles.libraryItemTop)}>
                    <span className={styles.libraryItemName}>
                        {props.name.length > 6 ? `${props.name.substring(0, 5)}...` : props.name}
                    </span>
                    <div
                        className={classNames(styles.iconButton, styles.iconItemShare)}
                        // onClick={e => props.onHandleShareClick(e)}
                        onClick={props.onHandleShareClick}
                    ><img src={shareIcon} />分享 </div>
                </Box>
                <Box className={styles.libraryItemContent}>
                    <span className={styles.libraryItemTime}>{props.datetime}</span>
                    <div
                        className={classNames(styles.iconButton, styles.iconItemDel)}
                        onClick={props.onHandleDeleteClick}
                    >
                        删除
                    </div>
                </Box>
            </Box>
        </Box>
        <Modal
            contentLabel="二维码"
            isOpen={props.qrModal}
            overlayClassName={styles.modalOverlay}
            style={qrStyles}
            onRequestClose={props.onHandleShareClose}
        >
            <p className={styles.shareTitle}>{props.name}</p>
            <QRCode
                size={180}
                value={props.codeSrc}
            />
            <div
                className={styles.closeBtn}
                onClick={props.onHandleShareClose}
            >
                关闭
            </div>
        </Modal>
    </Box>
);

ProjectLibraryItemComponent.propTypes = {
    codeSrc: PropTypes.string,
    datetime: PropTypes.string,
    onHandleDeleteClick: PropTypes.func,
    onHandleEditClick: PropTypes.func,
    onHandleMouseEnter: PropTypes.func,
    onHandleMouseLeave: PropTypes.func,
    onHandleShareClick: PropTypes.func,
    onHandleShareClose: PropTypes.func,
    iconURL: PropTypes.string,
    name: PropTypes.string,
    qrModal: PropTypes.bool
};
ProjectLibraryItemComponent.defaultProps = {
};

export default ProjectLibraryItemComponent;
