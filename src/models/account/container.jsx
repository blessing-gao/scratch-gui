import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import AccountComponent from './component.jsx';
import {openLoginModals} from '../../reducers/modals';
import {
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    fileMenuOpen,
    editMenuOpen,
    languageMenuOpen, loginMenuOpen
} from '../../reducers/menus';
import {getIsShowingProject, getIsUpdating} from "../../reducers/project-state";

class AccountContainer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
        this.state = {
        };
    }

    render () {
        return (<AccountComponent {...this.props} />);
    }

}

AccountContainer.propTypes = {
    onOpenLoginModal: PropTypes.func
};

const mapStateToProps = state => ({
    accountMenuOpen: accountMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
    onOpenLoginModal: () => dispatch(openLoginModals()),
    onOpenAccountMenu: () => dispatch(openAccountMenu()),
    onCloseAccountMenu: () => dispatch(closeAccountMenu())
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountContainer);
