import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import LibraryComponent from './component.jsx';
import {closeProjectModal} from '../../reducers/modals';
import {connect} from 'react-redux';
import {getUserProjects, getProjectTags} from '../../lib/service/project-api';

class ProjectLibrary extends React.Component {
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
            'handleTagClick',
            'getProjects'
        ]);
        this.state = {
            projects: [],
            tags: [],
            nowPage: 1,
            totalPage: 0,
            numbers: 15,
            searchContent: '',
            searchHis: '',
            searchType: ''
        };
    }

    componentDidMount () {
        this.getType(5); // 获取类别 type, platFormId, userToken
        this.getProjects();
    }

    getProjects (nowPage = this.state.nowPage){
        const data = {
            pagination: {
                number: this.state.numbers,
                start: (nowPage - 1) * this.state.numbers
            },
            search: {
                name: this.state.searchContent || null
            },
            sort: {
                predicate: 'create_time'
            }
        };
        if (this.state.searchType && this.state.searchType != '0'){
            data.search.type = this.state.searchType;
        }
        getUserProjects(data).then(json => {
            if (json.code === 0 && json.result) {
                this.setState({
                    projects: json.result.records,
                    nowPage: json.result.current,
                    totalPage: json.result.pages
                });
            }
        })
            .catch(error => {
                alert('网络错误！');
                throw error;
            });
    }

    getType (type){
        getProjectTags(type).then(data => {
            if (data.code === 0 && data.result) {
                const tags = [];
                data.result.map(tag => {
                    tags.push({id: tag.typeId, title: tag.name});
                    return tag;
                });
                if (tags){
                    console.log(tags);
                    this.setState({tags: tags});
                }

            }
        })
            .catch(error => {
                alert('网络错误！');
                throw error;
            });
    }

    handleTagClick (tag){
        console.log(tag);
        const tags = this.state.tags;
        let type = 0;
        for (const i in tags){
            if (tags[i].title === tag){
                type = tags[i].id;
                tags[i].active = true;
            } else {
                tags[i].active = false;
            }
        }
        console.log(tags)
        this.setState({searchType: type, tags: tags}, () => {
            this.getProjects(1);
        });
    }

    handleSearch (event){
        this.setState({searchContent: event.target.value});
    }

    // 键盘回车事件
    handleKeyDown (event){
        // console.log(event.keyCode);
        if (event.keyCode == 13){
            this.getProjects(1);
        }
        this.setState({searchHis: event.target.value});
    }

    handleClear (){
        this.setState({searchContent: ''}, () => {
            if (this.state.searchHis !== ''){
                this.getProjects(1);
                this.setState({searchHis: ''});
            }
        });
    }

    getLast (){
        if (this.state.nowPage != 1){
            this.getProjects(this.state.nowPage - 1);
        }
    }

    getNext (){
        if (this.state.nowPage != this.state.totalPage && this.state.totalPage != 0){
            this.getProjects(this.state.nowPage + 1);
        }
    }

    handleDelete (){
        this.getProjects(1);
    }
    render () {
        return (
            <LibraryComponent
                data={this.state.projects}
                filterQuery={this.state.searchContent}
                getLast={this.getLast}
                getNext={this.getNext}
                id="projectLibrary"
                nowPage={this.state.nowPage}
                tags={this.state.tags}
                totalPage={this.state.totalPage}
                onDelete={this.handleDelete}
                onHandleFilterChange={this.handleSearch}
                onHandleFilterClear={this.handleClear}
                onHandleFilterKeyDown={this.handleKeyDown}
                onHandleTagClick={this.handleTagClick}
                onRequestClose={this.props.onCloseProjectModal}
            />
        );
    }
}

ProjectLibrary.propTypes = {
    onCloseProjectModal: PropTypes.func
};

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
    onCloseProjectModal: () => dispatch(closeProjectModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectLibrary);
