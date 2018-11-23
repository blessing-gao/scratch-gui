import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import SaveProgressComponent from '../../components/my/save-progress.jsx';
/**
 * 本组件用于展示作品的保存进度
 */

class SaveProgress extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
        this.state = {

        };
    }

    componentDidMount (){

    }

    render () {
        return (
            <SaveProgressComponent {...this.props}/>);
    }

}

SaveProgress.propTypes = {
    loadStatus: PropTypes.number
};

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
   
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveProgress);
