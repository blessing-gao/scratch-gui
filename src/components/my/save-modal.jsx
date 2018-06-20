import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './save-modal.css';

const messages = {
    label: '作品发布'
};
const SaveModalComponent = props => {
    const {
        label,
        handleCancel,
        placeholder,
        title,
        workName,
        shotSrc
    } = props;

    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            contentLabel={messages.label}
            overlayClassName={styles.modalOverlay}
            onRequestClose={props.handleCancel}
        >
            <Box className={styles.body}>
                <Box className={styles.label}>
                    <h2>{messages.label}</h2>
                </Box>
                <Box>
                    <input
                        autoFocus
                        className={styles.input}
                        placeholder={placeholder}
                        value={workName}
                        // onChange={onChange}
                        // onKeyPress={props.onKeyPress}
                    />
                </Box>
                {/* <Box className={styles.label}>*/}
                {/* 封面*/}
                {/* </Box>*/}
                {/* <Box>*/}
                {/* <img*/}
                {/* height="300px"*/}
                {/* src={shotSrc}*/}
                {/* width="400px"*/}
                {/* />*/}
                {/* </Box>*/}
                <Box className={styles.buttonRow}>
                    <button
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        取消
                    </button>
                    <button
                        className={styles.okButton}
                        // onClick={() => onSave(false)}
                    >
                        另存
                    </button>
                    <button
                        className={styles.okButton}
                        // onClick={onSave}
                    >
                        保存
                    </button>
                </Box>
            </Box>
        </ReactModal>
    );

};

SaveModalComponent.propTypes = {
    label: PropTypes.string.isRequired,
    // onChange: PropTypes.func,
    handleCancel: PropTypes.func.isRequired,
    // onSave: PropTypes.func,
    // onKeyPress: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    shotSrc: PropTypes.string,
    title: PropTypes.string,
    workName: PropTypes.string
};
SaveModalComponent.defaultProps = {
    workName: '作品',
    title: '码猿',
    shotSrc: '343'
};

export default SaveModalComponent;
