import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import request from '../../lib/config';

import {
    activateTab,
    COSTUMES_TAB_INDEX
} from '../../reducers/editor-tab';

import analytics from '../../lib/analytics';
import LibraryComponent from './component.jsx';

const PUBLIC_RESOURCE = 1;
const PERSONAL_RESOURCE = 0;
const DEFAULT_RESOURCE = 2;
const BackdropType = 1;
const Personal = 1;
const notPersonal = 0;
class BackdropLibrary extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect',
            'handleChange',
            'getResource',
            'getDefault',
            'getType',
            'getUserResource'
        ]);
        this.state = {
            backdrop: [],
            tags: null
        };
    }

    componentDidMount () {
        this.getType(BackdropType);// 获取类别 type, platFormId, userToken
        this.checkResource();
        // this.getResource(1,1);    // 获取素材 type, platFormId, userToken, typeId
    }

    getDefault (){
        request.default_request(request.GET, null, '/backdrops.json', result => {
            if (result) {
                this.setState({backdrop: result});
            }
        }, '//cdn.imayuan.com');
    }

    getResource (type, isPersonal){
        request.default_request(request.GET, null, `/api/resource/getResourceByType?type=${type}&isPersonal=${isPersonal}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                localStorage.setItem('scripts1', JSON.stringify(result.result));
                localStorage.setItem('scriptsMd1', result.msg);
                this.setState({backdrop: result.result});
            }
        });
    }

    getUserResource (type){
        // 获取个人素材
        this.setState({backdrop: []});
        request.default_request(request.GET, null, `/api/resource/getUserResByType?type=${type}`, result => {
            if (result.result) {
                this.setState({backdrop: result.result});
            }
        });
    }

    getType (type){
        request.default_request(request.GET, null, `/api/scratch/type?type=${type}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                let tags = [];
                result.result.map(tag => {
                    tags.push({id: tag.typeId, title: tag.name});
                });
                this.setState({tags: tags});
            }
        });
    }

    checkResource (){
        if (true) {
            // 校验md5是否失效
            // 若失效,则请求获取资源且存入localstorage
            // 若未失效,则直接从localstorage中获取资源
            const scriptsMd1 = localStorage.getItem('scriptsMd1');
            if (scriptsMd1 !== null && scriptsMd1 !== '') {
                request.default_request(request.GET, null,
                    `/api/resource/checkResource?type=${BackdropType}&value=${scriptsMd1}`, result => {
                        if (result) {
                            this.setState({backdrop: JSON.parse(localStorage.getItem('scripts1'))});
                        } else {
                            this.getResource(BackdropType, notPersonal);
                        }
                    });
            } else {
                this.getResource(BackdropType, notPersonal);
            }
        } else {
            this.getDefault();
        }
    }

    handleChange (type){
        // 课程素材{type=1},默认素材{type=2}切换
        if (type === PUBLIC_RESOURCE){
            // this.getResource(1,1);
            this.checkResource();
        } else if (type === DEFAULT_RESOURCE) {
            this.getDefault();
        } else {
            // 获取个人
            this.getUserResource(BackdropType);
        }
    }


    handleItemSelect (item) {
        const vmBackdrop = {
            name: item.name,
            rotationCenterX: item.info[0] && item.info[0] / 2,
            rotationCenterY: item.info[1] && item.info[1] / 2,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.props.vm.setEditingTarget(this.props.stageID);
        this.props.onActivateTab(COSTUMES_TAB_INDEX);
        this.props.vm.addBackdrop(item.md5, vmBackdrop);
        analytics.event({
            category: 'library',
            action: 'Select Backdrop',
            label: item.name
        });
    }

    render () {
        return (
            <LibraryComponent
                data={this.state.backdrop}
                id="backdropLibrary"
                tags={this.state.tags}
                title="选择背景"
                type={BackdropType}
                iLogin={true}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
                onTabChange={this.handleChange}
                handleReload={() => this.getUserResource(BackdropType)}
            />
        );
    }
}

BackdropLibrary.propTypes = {
    onActivateTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    stageID: PropTypes.string.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    stageID: state.scratchGui.targets.stage.id
});

const mapDispatchToProps = dispatch => ({
    onActivateTab: tab => dispatch(activateTab(tab))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BackdropLibrary);
