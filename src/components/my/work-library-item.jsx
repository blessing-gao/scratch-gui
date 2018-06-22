import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {getHost} from '../../lib/request';
import request from '../../lib/request';
import Box from '../box/box.jsx';
import styles from './work-library-item.css';

const host = getHost();
class WorkLibraryItem extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditClick',
            'handleShareClick',
            'handleDeleteClick',
            'handleMouseEnter',
            'handleMouseLeave'
        ]);

        this.state = {
            status: false
        };
    }
    handleEditClick () {
        const createDate = this.props.datetime.substring(0, 10);
        const scratch1 = '2017-12-08';
        if (new Date(createDate.replace(/-/g, '/')) < new Date(scratch1.replace(/-/g, '/'))){
            console.log(new Date(createDate.replace(/-/g, '/')) + new Date(scratch1.replace(/-/g, '/')));
            window.location.href = `${host}/scratch_old/ide.html?projectId=${this.props.id}`;
        } else {
            window.location.href = `${host}/scratch/ide.html?projectId=${this.props.id}`;
        }
        // window.location.href = `${host}/scratch/ide.html?projectId=${this.props.id}`;
        // console.log(`http://localhost:8080/scratch/ide.html?projectId=${this.props.id}`)
        // window.location.href = `http://localhost:8080/scratch/ide.html?projectId=${this.props.id}`;
        // window.location.reload();
        // window.location.href = 'http://www.baidu.com';
    }
    handleShareClick () {
        const ercode = `http://imayuan.com/QcodeShare?projectId=${this.props.id}.jpg`;
        Modal.success({
            title: this.props.name,
            content: (
                <Card
                    hoverable
                    style={{width: 350}}
                >
                    <img
                        alt="example"
                        src={ercode}
                    />
                </Card>
            ),
            width: 480,
            footer: {}
        });
    }

    handleDeleteClick () {
        const data = {
            id: this.props.id
        };
        request.default_request(request.POST, data, '/internalapi/project/delete', result => {
            // 更新列表
            if (result){
                console.log(result);
                this.props.onDelete();
                message.info('删除成功');
            }
        });
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
                    className={this.state.status ?
                        styles.libraryItemhover : styles.libraryItem}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    {/* Layers of wrapping is to prevent layout thrashing on animation */}
                    <Box className={styles.libraryItemImageContainerWrapper}>
                        <Box className={styles.libraryItemImageContainer}>
                            <img
                                className={styles.libraryItemImage}
                                src={this.props.iconURL}
                            />
                        </Box>
                    </Box>
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                    {/* <br />*/}
                    {/* <span className={styles.libraryItemName}>{this.props.name}</span>*/}
                </Box>
                <Box
                    className={this.state.status ? `${styles.menuhover} ` : `${styles.menu} `}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <button
                        className={styles.menuEdit}
                        onClick={this.handleEditClick}
                    >
                        编辑
                    </button>
                    <button
                        className={styles.menuShare}
                        onClick={this.handleShareClick}
                    >分享</button>
                    <button
                        className={styles.menuDelete}
                        onClick={this.handleDeleteClick}
                    >删除</button>
                </Box>
            </Box>
        );
    }
}

WorkLibraryItem.propTypes = {
    datetime: PropTypes.string,
    iconURL: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func

};

export default WorkLibraryItem;
