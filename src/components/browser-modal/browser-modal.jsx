import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';

import styles from './browser-modal.css';

const messages = {
    label: '浏览器不支持'
};

const BrowserModal = ({...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={messages.label}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onBack}
    >
        <Box className={styles.illustration} />

        <Box className={styles.body}>
            <h2>
                {messages.label}
            </h2>
            <p>
                { /* eslint-disable max-len */ }
                我们很抱歉，码猿Scratch不支持Internet Explorer，Opera or Silk。我们建议尝试一种新的浏览器，如谷歌浏览器、Mozilla Firefox或微软Edgess。
                { /* eslint-enable max-len */ }
            </p>

            <Box className={styles.buttonRow}>
                <button
                    className={styles.backButton}
                    onClick={props.onBack}
                >
                    返回
                </button>
            </Box>
        </Box>
    </ReactModal>
);

BrowserModal.propTypes = {
    onBack: PropTypes.func.isRequired
};

export default BrowserModal;
