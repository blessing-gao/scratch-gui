import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../../components/box/box.jsx';
import styles from './style.css';
import classNames from 'classnames';

const messages = {
    label: '作品发布'
};

const PublishComponent = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={messages.label}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onHandleCancel}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                <h2 className={styles.labelTitle}>{messages.label}</h2>
            </Box>
            <div className={styles.contentBox}>
                <div className={styles.coverImg}>
                    <img src={props.coverSrc} />
                </div>
                <div className={styles.mainBox}>
                    <Box>
                        <input
                            autoFocus
                            className={styles.input}
                            placeholder={'请输入作品名称'}
                            value={props.project.name}
                            onChange={props.onChangeName}
                        />
                    </Box>
                    <Box>
                        <textarea
                            className={classNames(styles.input, styles.textarea)}
                            placeholder={'描述作品的操作说明'}
                            value={props.project.description}
                            onChange={props.onChangeDesc}
                        />
                    </Box>
                    <Box>
                        <p className={styles.classTitle}>作品分类:</p>
                        <div className={styles.classBox}>
                            {props.tags.map((tagProps, id) => (
                                <span
                                    className={classNames(
                                        styles.classBtn
                                        // (props.selectedTag == tagProps.title ? styles.activeBtn : '') // 选中
                                    )}
                                    // onClick={}
                                    key={tagProps.id}
                                >
                                    {tagProps.title}
                                </span>
                            ))}
                        </div>
                    </Box>
                </div>
            </div>
            <Box className={styles.buttonRow}>
                <Box className={styles.iAnon}><input
                    type="checkbox"
                    value="1"
                    // onClick={this.props.handleAnon}
                /> 是否匿名发布</Box>
                <button
                    className={styles.cancelButton}
                    onClick={props.onHandleCancel}
                >
                    取消
                </button>
                <button
                    className={styles.okButton}
                    className={
                        classNames(styles.okButton
                            // (this.props.iDisable && styles.okButtonDisable)
                        )}
                    onClick={props.onHandleSave}
                    // disabled={this.props.iDisable}
                >
                        发布
                </button>
            </Box>
        </Box>
    </ReactModal>
);

PublishComponent.propTypes = {
    coverSrc: PropTypes.string,
    onChangeDesc: PropTypes.func,
    onChangeName: PropTypes.func,
    onHandleCancel: PropTypes.func,
    onHandleSave: PropTypes.func,
    project: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string
    }),
    shotSrc: PropTypes.string,
    tags: PropTypes.arrayOf()

};

PublishComponent.defaultProps = {
    coverSrc: null,
    onChangeDesc: () => {},
    onHandleSave: () => {},
    onChangeName: () => {}
};

export default PublishComponent;
