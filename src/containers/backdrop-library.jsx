import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import request from '../lib/request';

import {
    activateTab,
    COSTUMES_TAB_INDEX
} from '../reducers/editor-tab';

import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';
import {setWork} from '../reducers/scratch';

class BackdropLibrary extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect',
            'handleChange',
            'getResource',
            'getDefault',
            'getType'
        ]);
        this.state = {
            backdrop: [],
            tags: null
        };
    }

    getDefault (){
        request.default_request(request.GET, null, '/backdrops.json', result => {
            if (result) {
                this.setState({backdrop: result});
            }
        },'//cdn.imayuan.com');
    }

    handleChange (type){
        // 课程素材{type=1},默认素材{type=2}切换
        if(type == 1){
            this.getResource(1,1);
        }else {
            this.getDefault();
        }
    }

    getResource (type, typeId){
        let work = this.props.work;
        request.default_request(request.GET, null, `/api/scratch/getResByType?type=${type}&platFormId=${work.platFormId}&userToken=${work.userToken}&typeId=${typeId}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                this.setState({backdrop: result.result});
            }
        });
    }

    getType (type){
        let work = this.props.work;
        request.default_request(request.GET, null, `/api/scratch/type?type=${type}&platFormId=${work.platFormId}&userToken=${work.userToken}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                let tags = [];
                result.result.map(tag => {
                    tags.push({id:tag.id,title:tag.name});
                });
                this.setState({tags:tags});
            }
        });
    }

    componentDidMount () {
        this.getType(1);    // 获取类别 type, platFormId, userToken
        this.getResource(1,1);    // 获取素材 type, platFormId, userToken, typeId
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
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
                onTabChange={this.handleChange}
            />
        );
    }
}

BackdropLibrary.propTypes = {
    onActivateTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    stageID: PropTypes.string.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    work: PropTypes.object
};

const mapStateToProps = state => ({
    stageID: state.scratchGui.targets.stage.id,
    work: state.scratchGui.scratch.work
});

const mapDispatchToProps = dispatch => ({
    onActivateTab: tab => dispatch(activateTab(tab))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BackdropLibrary);
