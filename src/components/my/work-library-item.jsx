import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {getHost} from '../../lib/request';
import request from '../../lib/request';
import Box from '../box/box.jsx';
import styles from './work-library-item.css';
import {connect} from 'react-redux';
import {setWork} from '../../reducers/scratch';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import shareIcon from '../../lib/assets/share-icon.png';

const host = getHost();

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        padding               : '1.5rem 2rem',
        borderRadius          : '.5rem'
    }
};

class WorkLibraryItem extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditClick',
            'handleShareClick',
            'handleDeleteClick',
            'handleMouseEnter',
            'handleMouseLeave',
            'handleShareClose'
        ]);

        this.state = {
            status: false,
            isModal: false,
            codeSrc: ""
        };
    }
    handleEditClick () {
        window.location.href = `${host}/?id=${this.props.id}&platFormId=${this.props.work.platFormId}`;
    }
    handleShareClick (e) {
        const ercode = `http://imayuan.com/player/mobile/game.html?projectId=${this.props.id}`;
        this.setState({isModal: true,codeSrc: ercode});
        e.stopPropagation();
    }

    handleShareClose(){
        this.setState({isModal: false});
    }

    handleDeleteClick (e) {
        const conf = confirm('是否确认删除');
        if(conf === true){
            let work = this.props.work;
            const data = {
                scratchId: this.props.id
            };
            request.default_request(request.POST, data, '/api/scratch/delete', result => {
                // 更新列表
                if (result){
                    this.props.onDelete();
                }
            });
            e.stopPropagation();
        }else {
            e.stopPropagation();
        }
    }
    handleMouseEnter () {
        const that = this;
        that.setState({
            status: true
        });
    }
    handleMouseLeave () {
        const that = this;
        that.setState({
            status: false
        });
    }
    render () {
        return (
            <Box>
                <Box
                    className={styles.libraryItem}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    {/* Layers of wrapping is to prevent layout thrashing on animation */}
                    <Box className={styles.libraryItemImageContainerWrapper}
                         onClick={this.handleEditClick}
                    >
                        <img
                            className={styles.libraryItemImage}
                            src={this.props.iconURL}
                        />
                    </Box>
                    <Box className={styles.libraryItemContainer}>
                        <Box className={classNames(styles.libraryItemContent,styles.libraryItemTop)}>
                            <span className={styles.libraryItemName}>{this.props.name}</span>
                            <div className={classNames(styles.iconButton,styles.iconItemShare)} onClick={e => this.handleShareClick(e)}><img src={shareIcon}/>分享</div>
                        </Box>
                        <Box className={styles.libraryItemContent}>
                            <span className={styles.libraryItemTime}>{this.props.datetime}</span>
                            <div className={classNames(styles.iconButton,styles.iconItemDel)} onClick={e => this.handleDeleteClick(e)}>删除</div>
                        </Box>
                    </Box>
                    {/* <br />*/}
                    {/* <span className={styles.libraryItemName}>{this.props.name}</span>*/}
                </Box>
                <Modal
                    isOpen={this.state.isModal}
                    onRequestClose={this.handleShareClose}
                    contentLabel="Example Modal"
                    style={customStyles}
                    overlayClassName={styles.modalOverlay}
                >
                    <p className={styles.shareTitle}>{this.props.name}</p>
                    <QRCode size={180} value={this.state.codeSrc}/>
                    <div className={styles.closeBtn} onClick={this.handleShareClose}>关闭</div>
                </Modal>

            </Box>
        );
    }
}

WorkLibraryItem.propTypes = {
    datetime: PropTypes.string,
    iconURL: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    work: PropTypes.object

};

const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work
});

const mapDispatchToProps = dispatch => ({
    setWork:work => {
        dispatch(setWork(work));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkLibraryItem);

