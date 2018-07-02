import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './save-modal.css';
import classNames from 'classnames';

const messages = {
    label: '作品发布'
};

class SaveModalComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTagClick'
        ]);
        this.state = {
            selectedTag: ''
        };
    }

    handleTagClick(tag){
        this.setState({selectedTag:tag});
        this.props.handleTagClick(tag);
    }

    render(){
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                contentLabel={messages.label}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.handleCancel}
            >
                <Box className={styles.body}>
                    <Box className={styles.label}>
                        <h2 className={styles.labelTitle}>{messages.label}</h2>
                    </Box>
                    <Box>
                        <input
                            autoFocus
                            className={styles.input}
                            placeholder={this.props.placeholder}
                            value={this.props.workName}
                            onChange={this.props.onChangeName}
                        />
                    </Box>
                    <Box>
                    <textarea
                        className={classNames(styles.input, styles.textarea)}
                        placeholder={this.props.desPlaceholder}
                        value={this.props.describe}
                        onChange={this.props.onChangeDesc}
                    />
                    </Box>
                    <Box>
                        <p className={styles.classTitle}>作品分类:</p>
                        <div className={styles.classBox}>
                            {this.props.tags.map((tagProps,id) => (
                                <span
                                    className={classNames(
                                    styles.classBtn,
                                    (this.state.selectedTag == tagProps.title ? styles.activeBtn : '')
                                )}
                                    onClick={this.handleTagClick.bind(this,tagProps.title)}
                                    key={tagProps.id}
                                >
                                {tagProps.title}
                            </span>
                            ))}
                        </div>
                    </Box>
                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.cancelButton}
                            onClick={this.props.handleCancel}
                        >
                            取消
                        </button>
                        <button
                            className={styles.okButton}
                        >
                            发布
                        </button>
                    </Box>
                </Box>
            </ReactModal>
        );
    }
}

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
