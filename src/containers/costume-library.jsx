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
            'getType',
            'getUserResource'
        ]);
        this.state = {
            costumes: [],
            tags: null
        };
    }
    handleItemSelected (item) {
        const split = item.md5.split('.');
        const type = split.length > 1 ? split[1] : null;
        const rotationCenterX = type === 'svg' ? item.info[0] : item.info[0] / 2;
        const rotationCenterY = type === 'svg' ? item.info[1] : item.info[1] / 2;
        const vmCostume = {
            name: item.name,
            rotationCenterX,
            rotationCenterY,
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
        request.default_request(request.GET, null, `/api/scratch/getResByType?type=${type}&typeId=${typeId}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                localStorage.setItem('scripts3', JSON.stringify(result.result));
                localStorage.setItem('scriptsMd3', result.msg);
                this.setState({costumes: result.result});
            }
        });
    }

    getUserResource(type, typeId){
        // 获取个人素材
        this.setState({costumes: []});
        request.default_request(request.GET, null, `/api/resource/getUserResByType?type=${type}&typeId=${typeId}`, result => {
            if (result.result) {
                this.setState({costumes: result.result});
            }
        });
    }

    getType (type){
        let work = this.props.work;
        if(work.userToken) {
            request.default_request(request.GET, null, `/api/scratch/type?type=${type}&platFormId=${work.platFormId}`, result => {
                if (result.code !== request.NotFindError && result.result) {
                    let tags = [];
                    result.result.map(tag => {
                        tags.push({id: tag.typeId, title: tag.name});
                    });
                    this.setState({tags: tags});
                }
            });
        }
    }

    checkResource (){
        let work = this.props.work;
        if(work.userToken){
            // 校验md5是否失效
            // 若失效,则请求获取资源且存入localstorage
            // 若未失效,则直接从localstorage中获取资源
            const scriptsMd3 = localStorage.getItem('scriptsMd3');
            if (scriptsMd3 !== null && scriptsMd3 !== ''){
                request.default_request(request.GET, null,
                    `/api/scratch/checkResource?type=3&value=${scriptsMd3}`, result => {
                        if (result){
                            this.setState({costumes: JSON.parse(localStorage.getItem('scripts3'))});
                        } else {
                            this.getResource(1,3);
                        }
                    });
            }else{
                this.getResource(1,3);
            }
        }else {
            this.getDefault();
        }
    }

    componentDidMount () {
        this.getType(3);    // 获取类别 type, platFormId, userToken
        this.checkResource();
        // this.getResource(1,3);    // 获取素材 type, platFormId, userToken, typeId
    }

    handleChange (type){
        // 课程素材{type=1},默认素材{type=2}切换
        if(type == 1){
            // this.getResource(1,3);
            this.checkResource();
        }else if(type == 2) {
            this.getDefault();
        }else {
            // 获取个人素材
            this.getUserResource(1,3);
        }
    }
 
    render () {
        return (
            <LibraryComponent
                data={this.state.costumes}
                id="costumeLibrary"
                tags={this.state.tags}
                title="选择造型"
                type={3}
                iLogin={this.props.work.userToken ? true : false}
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
                onTabChange={this.handleChange}
                handleReload={() => this.getUserResource(1,3)}
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
