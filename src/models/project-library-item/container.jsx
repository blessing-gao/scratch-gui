import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {getHost} from '../../lib/config';
import {connect} from 'react-redux';
import {deleteProject} from '../../lib/service/project-api';
import ProjectLibraryItemComponent from './component.jsx';

class ProjectLibraryContainer extends React.PureComponent {
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
            mouseEnterStatus: false,
            qrModal: false,
            codeSrc: ''
        };
    }
    handleEditClick () {
        window.location.href = `/?id=${this.props.id}`;
    }
    handleShareClick (e) {
        const code = `https://scratch.imayuan.com/mobile-player/?id=${this.props.id}`;
        this.setState({qrModal: true, codeSrc: code});
        e.stopPropagation(); // 控制停止事件传播
    }

    handleShareClose (){
        this.setState({qrModal: false});
    }

    handleDeleteClick (e) {
        const conf = confirm('是否确认删除');
        if (conf === true){
            // 执行删除作品
            deleteProject(this.props.id).then(() => {
                this.props.onDelete(); // 执行完成后，通知父组件进行删除操作
            })
                .catch(error => {
                    alert('网络错误！');
                    throw error;
                })
                .finally(() => {
                    e.stopPropagation();
                });
        } else {
            e.stopPropagation();
        }
    }
    handleMouseEnter () {
        this.setState({
            mouseEnterStatus: true
        });
    }
    handleMouseLeave () {
        this.setState({
            mouseEnterStatus: false
        });
    }
    render () {
        return (
            <ProjectLibraryItemComponent
                onHandleDeleteClick={this.handleDeleteClick}
                onHandleEditClick={this.handleEditClick}
                onHandleMouseEnter={this.handleMouseEnter}
                onHandleMouseLeave={this.handleMouseLeave}
                onHandleShareClick={this.handleShareClick}
                onHandleShareClose={this.handleShareClose}
                {...this.props}
            />
        );
    }
}

ProjectLibraryContainer.propTypes = {
    datetime: PropTypes.string,
    iconURL: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    onDelete: PropTypes.func
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectLibraryContainer);
