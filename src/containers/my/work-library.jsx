import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLibraryComponent from '../../components/my/work-library.jsx';
import request from '../../lib/request';
import {closeWorkLibrary} from "../../reducers/modals";
import {connect} from "react-redux";
import {setWork} from '../../reducers/scratch';

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

    getResource (){
        let work = this.props.work;
        let data = {
            "pagination": {
                "number": 20,
                "start": 21
            },
            "search": {},
            "sort": {
                "predicate" : "create_time"
            },
            "platFormId": work.platFormId,
            "userToken": work.userToken
        };
        request.default_request(request.POST, JSON.stringify(data), `/api/scratch/worksList`, result => {
            if (result.code !== request.NotFindError && result.result) {
                this.setState({works: result.result.records});
            }
        },"","application/json");
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
        this.getType(5);    // 获取类别 type, platFormId, userToken
        this.getResource();
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
    closeWorkLibrary: PropTypes.func,
    work: PropTypes.object
};

const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work
});
const mapDispatchToProps = dispatch => ({
    closeWorkLibrary: () => {
        dispatch(closeWorkLibrary());
    },
    setWork:work => {
        dispatch(setWork(work));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkLibrary);
