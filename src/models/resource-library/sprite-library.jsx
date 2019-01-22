import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import analytics from '../../lib/analytics';

import LibraryComponent from './component.jsx';
import request from '../../lib/config';

const PUBLIC_RESOURCE = 1;
const PERSONAL_RESOURCE = 0;
const DEFAULT_RESOURCE = 2;
const SpriteType = 2;
const Personal = 1;
const notPersonal = 0;
class SpriteLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect',
            'handleMouseEnter',
            'handleMouseLeave',
            'rotateCostume',
            'startRotatingCostumes',
            'stopRotatingCostumes',
            'handleChange',
            'getResource',
            'getDefault',
            'getType',
            'handleDelete',
            'handleEdit',
            'getUserResource'

        ]);
        this.state = {
            activeSprite: null,
            costumeIndex: 0,
            sprites: [],
            tags: null,
            type: DEFAULT_RESOURCE // 素材类型:个人,课程,默认
        };
    }

    componentDidMount () {
        this.getType(SpriteType); // 获取类别 type
        // this.getResource(1,2);    // 获取素材 type, typeId
        this.checkResource();
    }

    componentWillUnmount () {
        clearInterval(this.intervalId);
    }

    handleEdit (md5){
        console.log(md5);
    }

    handleDelete (md5){
        console.log(md5);
    }

    getResource (type, isPersonal){
        request.default_request(request.GET, null, `/api/resource/getResourceByType?type=${type}&isPersonal=${isPersonal}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                localStorage.setItem('scripts2', JSON.stringify(result.result));
                localStorage.setItem('scriptsMd2', result.msg);
                this.setState({sprites: result.result});
            }
        });
    }

    getDefault (){
        request.default_request(request.GET, null, '/sprites.json', result => {
            if (result) {
                this.setState({sprites: result});
            }
        }, '//cdn.imayuan.com');
    }


    getUserResource (type){
        // 获取个人素材
        this.setState({sprites: []});
        request.default_request(request.GET, null, `/api/resource/getUserResByType?type=${type}`, result => {
            if (result.result) {
                this.setState({sprites: result.result});
            }
        });
    }

    getType (type){
        request.default_request(request.GET, null, `/api/scratch/type?type=${type}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                const tags = [];
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
            const scriptsMd2 = localStorage.getItem('scriptsMd2');
            if (scriptsMd2 !== null && scriptsMd2 !== '') {
                request.default_request(request.GET, null,
                    `/api/resource/checkResource?type=${SpriteType}&value=${scriptsMd2}`, result => {
                        if (result) {
                            this.setState({sprites: JSON.parse(localStorage.getItem('scripts2'))});
                        } else {
                            // 资源失效
                            this.getResource(SpriteType, notPersonal);
                        }
                    });
            } else {
                // 重新加载
                this.getResource(SpriteType, notPersonal);
            }
        } else {
            this.getDefault();
        }
    }

    handleItemSelect (item) {
        this.props.vm.addSprite(JSON.stringify(item.json));
        analytics.event({
            category: 'library',
            action: 'Select Sprite',
            label: item.name
        });
    }
    handleMouseEnter (item) {
        this.stopRotatingCostumes();
        this.setState({activeSprite: item}, this.startRotatingCostumes);
    }
    handleMouseLeave () {
        this.stopRotatingCostumes();
    }
    handleChange (type){
        // 个人素材{type=0},课程素材{type=1},默认素材{type=2}切换
        this.setState({type: type});
        if (type === PUBLIC_RESOURCE){
            this.checkResource();
        } else if (type === DEFAULT_RESOURCE) {
            this.getDefault();
        } else {
            this.getUserResource(SpriteType);
        }
    }
    startRotatingCostumes () {
        if (!this.state.activeSprite) return;
        this.rotateCostume();
        this.intervalId = setInterval(this.rotateCostume, 300);
    }
    stopRotatingCostumes () {
        this.intervalId = clearInterval(this.intervalId);
    }
    rotateCostume () {
        const costumes = this.state.activeSprite.json.costumes;
        const nextCostumeIndex = (this.state.costumeIndex + 1) % costumes.length;
        this.setState({
            costumeIndex: nextCostumeIndex,
            sprites: this.state.sprites.map(sprite => {
                if (sprite.name === this.state.activeSprite.name) {
                    return {
                        ...sprite,
                        md5: sprite.json.costumes[nextCostumeIndex].baseLayerMD5
                    };
                }
                return sprite;
            })
        });
    }
    render () {
        return (
            <LibraryComponent
                data={this.state.sprites}
                id="spriteLibrary"
                tags={this.state.tags}
                title="选择角色"
                type={SpriteType}
                handleReload={() => this.getUserResource(SpriteType)}
                iLogin={true}
                onItemMouseEnter={this.handleMouseEnter}
                onItemMouseLeave={this.handleMouseLeave}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
                onTabChange={this.handleChange}
            />
        );
    }
}

SpriteLibrary.propTypes = {
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SpriteLibrary);
