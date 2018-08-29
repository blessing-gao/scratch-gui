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
            'handleDelete',
            'getLast',
            'getNext',
            'handleSearch',
            'handleClear',
            'handleKeyDown',
            'handleTagClick'
        ]);
        this.state = {
            works: [],
            tags: [],
            nowPage: 1,
            totalPage: 0,
            numbers: 14,
            searchContent: '',
            searchHis: '',
            searchType: ''
        };
    }

    getResource (nowPage = this.state.nowPage){
        let work = this.props.work;
        let data = {
            "pagination": {
                "number": this.state.numbers,
                "start": (nowPage - 1) * this.state.numbers
            },
            "search": {
                "name": this.state.searchContent || null,
                "type": this.state.searchType || null
            },
            "sort": {
                "predicate" : "create_time"
            }
        };
        if(this.state.searchType === 0){
            data.search.type = 0;
        }
        request.default_request(request.POST, JSON.stringify(data), `/api/scratch/workslist/${work.userId}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                this.setState({
                    works: result.result.records,
                    nowPage: result.result.current,
                    totalPage: result.result.pages
                });
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

    handleTagClick (tag){
        if(tag == '已发布'){
            tag = '1';
        }else if(tag == '未发布'){
            tag = '0';
        }else if(tag == '所有'){
            tag = '';
        }
        this.setState({searchType: tag}, () => {
            this.getResource(1);
        });
    }

    handleSearch(event){
        this.setState({searchContent: event.target.value});
    }

    handleKeyDown(event){
        // console.log(event.keyCode);
        if(event.keyCode == 13){
            this.getResource(1);
        }
        this.setState({searchHis: event.target.value});
    }

    handleClear(){
        this.setState({searchContent: ''}, () => {
            if(this.state.searchHis != ''){
                this.getResource(1);
                this.setState({searchHis: ''});
            }
        });
    }

    getLast(){
        if(this.state.nowPage != 1){
            this.getResource(this.state.nowPage - 1);
        }
        // this.setState({ nowPage: this.state.nowPage - 1 }, () => {
        //     this.getResource();
        // });
    }

    getNext(){
        if(this.state.nowPage != this.state.totalPage && this.state.totalPage != 0){
            this.getResource(this.state.nowPage + 1);
        }
        // this.getResource(this.state.nowPage + 1);
        // this.setState({ nowPage: this.state.nowPage + 1 }, () => {
        //     this.getResource();
        // });
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
        this.getResource(1);
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
                getLast={this.getLast}
                getNext={this.getNext}
                nowPage={this.state.nowPage}
                totalPage={this.state.totalPage}
                handleFilterChange={this.handleSearch}
                handleFilterKeyDown={this.handleKeyDown}
                handleFilterClear={this.handleClear}
                filterQuery={this.state.searchContent}
                handleTagClick={this.handleTagClick}
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
