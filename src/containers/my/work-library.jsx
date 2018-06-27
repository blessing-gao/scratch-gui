import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLibraryComponent from '../../components/my/work-library.jsx';
import request from '../../lib/request';
import {closeWorkLibrary} from "../../reducers/modals";
import {connect} from "react-redux";

class WorkLibrary extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'componentDidMount',
            'handleDelete'

        ]);
        this.state = {
            works: [],
            tags: []
        };
    }

    componentDidMount (){
        // request.default_request(request.GET, {}, '/internalapi/project/list', result => {
        //     if (typeof result.value !== 'undefined'){
        //         this.setState({workList: result.value});
        //     }
        // });
    }
    handleDelete (){
        // request.default_request(request.GET, {}, '/internalapi/project/list', result => {
        //     if (typeof result.value !== 'undefined'){
        //         this.setState({workList: result.value});
        //     }
        // });
    }
    render () {
        return (

            <WorkLibraryComponent
                data={this.state.works}
                tags={this.state.tags}
                id="workLibrary"
                title="我的作品库"
                onDelete={this.handleDelete}
                onRequestClose={this.props.closeWorkLibrary}
            />
        );
    }
}

WorkLibrary.propTypes = {
    closeWorkLibrary: PropTypes.func
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
    closeWorkLibrary: () => {
        dispatch(closeWorkLibrary());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkLibrary);
