import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';
import request from '../lib/request';
import {connect} from 'react-redux';
import {setWork} from '../reducers/scratch';

class CostumeLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelected',
            'handleChange',
            'getResource',
            'getDefault',
            'getType'
        ]);
        this.state = {
            costumes: [],
            tags: null
        };
    }
    handleItemSelected (item) {
        const vmCostume = {
            name: item.name,
            rotationCenterX: item.info[0],
            rotationCenterY: item.info[1],
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.props.vm.addCostume(item.md5, vmCostume);
        analytics.event({
            category: 'library',
            action: 'Select Costume',
            label: item.name
        });
    }

    getDefault (){
        request.default_request(request.GET, null, '/costumes.json', result => {
            if (result) {
                this.setState({costumes: result});
            }
        },'//cdn.imayuan.com');
    }

    getResource (type, typeId){
        let work = this.props.work;
        request.default_request(request.GET, null, `/api/scratch/getResByType?type=${type}&platFormId=${work.platFormId}&userToken=${work.userToken}&typeId=${typeId}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                this.setState({costumes: result.result});
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
        this.getType(3);    // 获取类别 type, platFormId, userToken
        this.getResource(1,3);    // 获取素材 type, platFormId, userToken, typeId
    }

    handleChange (type){
        // 课程素材{type=1},默认素材{type=2}切换
        if(type == 1){
            this.getResource(1,3);
        }else {
            this.getDefault();
        }
    }

    render () {
        return (
            <LibraryComponent
                data={this.state.costumes}
                id="costumeLibrary"
                tags={this.state.tags}
                title="选择造型"
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

CostumeLibrary.propTypes = {
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    work: PropTypes.object
};

const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work
});

const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CostumeLibrary);
