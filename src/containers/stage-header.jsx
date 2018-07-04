import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
import {STAGE_SIZE_MODES} from '../lib/layout-constants';
import {setStageSize} from '../reducers/stage-size';
import {setFullScreen} from '../reducers/mode';

import {connect} from 'react-redux';

import StageHeaderComponent from '../components/stage-header/stage-header.jsx';

// eslint-disable-next-line react/prefer-stateless-function
class StageHeader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleKeyPress',
            'quickScreenshot'
        ]);
        this.renderer = this.props.vm.runtime.renderer;
    }
    componentDidMount () {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress (event) {
        if (event.key === 'Escape' && this.props.isFullScreen) {
            this.props.onSetStageUnFull(false);
        }
    }
    quickScreenshot (){
        // const shotBtn = document.getElementById('shotBtn');
        // fireKeyEvent(shotBtn, 'keydown', 16);
        // console.log('fireKeyEvent');
        const c= document.createElement('canvas');
        //创建image对象
        let imgObj = new Image();
        imgObj.src = "http://cdn.imayuan.com/04d2540cc9564c05a30648e58a0947a3.svg";
        //待图片加载完后，将其显示在canvas上
        imgObj.onload = function(){
            let ctx = c.getContext('2d');
            ctx.drawImage(imgObj, 0, 0);//this即是imgObj,保持图片的原始大小：470*480
            //ctx.drawImage(this, 0, 0,1024,768);//改变图片的大小到1024*768
        }
        let img = new Image();
        img.src = c.toDataURL('image/jpg',0.7);
        console.log(img.src)
        // window.sessionStorage.setItem("coverImg",img.src);
        // this.props.vm.render
    }
    render () {
        const {
            ...props
        } = this.props;
        return (
            <StageHeaderComponent
                {...props}
                onKeyPress={this.handleKeyPress}
                onQuickScreenshot={this.quickScreenshot}
            />
        );
    }
}

StageHeader.propTypes = {
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    onSetStageUnFull: PropTypes.func.isRequired,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly
});

const mapDispatchToProps = dispatch => ({
    onSetStageLarge: () => dispatch(setStageSize(STAGE_SIZE_MODES.large)),
    onSetStageSmall: () => dispatch(setStageSize(STAGE_SIZE_MODES.small)),
    onSetStageFull: () => dispatch(setFullScreen(true)),
    onSetStageUnFull: () => dispatch(setFullScreen(false))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageHeader);
