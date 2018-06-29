import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {setWork} from '../reducers/scratch';
import analytics from '../lib/analytics';
// import spriteLibraryContent from '../lib/libraries/sprites.json';
import spriteTags from '../lib/libraries/sprite-tags';

import LibraryComponent from '../components/library/library.jsx';
import request from '../lib/request';

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
            'getType'

        ]);
        this.state = {
            activeSprite: null,
            costumeIndex: 0,
            sprites: [],
            tags: null
        };
    }

    getResource (type, typeId){
        let work = this.props.work;
        request.default_request(request.GET, null, `/api/scratch/getResByType?type=${type}&platFormId=${work.platFormId}&userToken=${work.userToken}&typeId=${typeId}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                this.setState({sprites: result.result});
            }
        });
    }

    getDefault (){
        request.default_request(request.GET, null, '/sprites.json', result => {
            if (result) {
                this.setState({sprites: result});
            }
        },'http://cdn.imayuan.com');
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
        this.getType(2);    // 获取类别 type
        this.getResource(1,2);    // 获取素材 type, typeId
    }

    componentWillUnmount () {
        clearInterval(this.intervalId);
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
        // 课程素材{type=1},默认素材{type=2}切换
        if(type == 1){
            this.getResource(1,2);
        }else {
            this.getDefault();
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
    vm: PropTypes.instanceOf(VM).isRequired,
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
)(SpriteLibrary);

