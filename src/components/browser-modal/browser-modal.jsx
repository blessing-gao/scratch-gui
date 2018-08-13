import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

import styles from './browser-modal.css';

const messages = defineMessages({
    label: {
        id: 'gui.unsupportedBrowser.label',
        defaultMessage: 'Browser is not supported',
        description: ''
    }
});

const BrowserModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.label})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onBack}
    >
        <Box className={styles.illustration} />

        <Box className={styles.body}>
            <h2>
                <FormattedMessage {...messages.label} />
            </h2>
            <p>
                我们很抱歉，码猿Scratch不支持Internet Explorer，Opera or Silk。我们建议尝试一种新的浏览器，如谷歌浏览器、Mozilla Firefox或微软Edgess。
            </p>

            <Box className={styles.buttonRow}>
                <button
                    className={styles.backButton}
                    onClick={props.onBack}
                >
                    <FormattedMessage
                        defaultMessage="Back"
                        description="Button to go back in unsupported browser modal"
                        id="gui.unsupportedBrowser.back"
                    />
                </button>

            </Box>
            <div className={styles.faqLinkText}>
                <FormattedMessage
                    defaultMessage="To learn more, go to the {previewFaqLink}."
                    description="Invitation to try 3.0 preview"
                    id="gui.unsupportedBrowser.previewfaq"
                    values={{
                        previewFaqLink: (
                            <a
                                className={styles.faqLink}
                                href="//scratch.mit.edu/3faq"
                            >
                                <FormattedMessage
                                    defaultMessage="FAQ"
                                    description="link to Scratch 3.0 FAQ page"
                                    id="gui.unsupportedBrowser.previewfaqlinktext"
                                />
                            </a>
                        )
                    }}
                />
            </div>
        </Box>
    </ReactModal>
);

BrowserModal.propTypes = {
    intl: intlShape.isRequired,
    onBack: PropTypes.func.isRequired
};

export default injectIntl(BrowserModal);
