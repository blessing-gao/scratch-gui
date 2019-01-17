import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import LoginComponent from './component.jsx';
import {closeLoginModal} from '../../reducers/modals';


/**
 * 本组件用于向服务器保存作品
 */

class LoginContainer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
        ]);
        this.state = {
        };
    }

    render () {
        return (<LoginComponent onHandleCancel={this.props.onCloseLoginModal} />);
    }

}

LoginContainer.propTypes = {
    onCloseLoginModal: PropTypes.func
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onCloseLoginModal: () => dispatch(closeLoginModal())

});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);
