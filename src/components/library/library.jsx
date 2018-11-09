import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import LibraryItem from '../library-item/library-item.jsx';
import LibraryUpload from '../library-upload/library-upload.jsx';
import Modal from '../../containers/modal.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';
import TagButton from '../../containers/tag-button.jsx';
import analytics from '../../lib/analytics';

import styles from './library.css';

import courseRes from '../../lib/assets/course-res.png';
import courseResAct from '../../lib/assets/course-res-active.png';
import defRes from '../../lib/assets/def-res.png';
import defResAct from '../../lib/assets/def-res-active.png';
import userRes from '../../lib/assets/user-res.png';
import userResAct from '../../lib/assets/user-res-active.png';
import uploadBg from '../../lib/assets/upload-bg.png';
import libraryEditBtn from '../../lib/assets/edit-icon.png';


// const ALL_TAG_TITLE = 'All';
const ALL_TAG_TITLE = '全部素材';
const tagListPrefix = [{id: 0, title: ALL_TAG_TITLE}];

const messages = {
    filterPlaceholder: '搜索'
};

const rescourseType = [
    { value: "0", label: "个人素材", def: userRes, active: userResAct},
    { value: "1", label: "课堂素材", def: courseRes, active: courseResAct},
    { value: "2", label: "默认素材", def: defRes, active: defResAct}
];

class LibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleBlur',
            'handleClose',
            'handleFilterChange',
            'handleFilterClear',
            'handleFocus',
            'handleMouseEnter',
            'handleMouseLeave',
            'handleSelect',
            'handleTagClick',
            'handleTypeClick',
            'setFilteredDataRef',
            'handleMenu',
            'handleUploadClose',
            'handleUploadOpen',
            'handleDelete',
            'handleEdit',
            'handleChangeEditStatus'
        ]);
        this.state = {
            selectedItem: null,
            filterQuery: '',
            selectedTag: ALL_TAG_TITLE,
            selectedType: '1',
            uploadVisible: false,
            rescourseId: '0',
            isEdit: false
        };
    }
    componentDidUpdate (prevProps, prevState) {
        if (prevState.filterQuery !== this.state.filterQuery ||
            prevState.selectedTag !== this.state.selectedTag) {
            this.scrollToTop();
        }
    }
    handleEdit (md5){
        this.props.onEdit(md5)
    }
    handleDelete (md5){
        this.props.onDelete(md5)
    }
    handleBlur (id) {
        this.handleMouseLeave(id);
    }
    handleFocus (id) {
        this.handleMouseEnter(id);
    }
    handleSelect (id) {
        this.handleClose();
        this.props.onItemSelected(this.getFilteredData()[id]);
    }
    handleClose () {
        this.props.onRequestClose();
        analytics.pageview(`/${this.props.id}/search?q=${this.state.filterQuery}`);
    }
    handleTagClick (tag) {
        this.setState({
            filterQuery: '',
            selectedTag: tag
        });
    }
    handleTypeClick (tag) {
        this.setState({
            filterQuery: '',
            selectedType: tag
        });
        this.props.onTabChange(tag);
    }
    handleMouseEnter (id) {
        if (this.props.onItemMouseEnter) this.props.onItemMouseEnter(this.getFilteredData()[id]);
    }
    handleMouseLeave (id) {
        if (this.props.onItemMouseLeave) this.props.onItemMouseLeave(this.getFilteredData()[id]);
    }
    handleFilterChange (event) {
        this.setState({
            filterQuery: event.target.value,
            selectedTag: ALL_TAG_TITLE
        });
    }
    handleFilterClear () {
        this.setState({filterQuery: ''});
    }
    getFilteredData () {
        if (this.state.selectedTag === '全部素材') {
            if (!this.state.filterQuery) return this.props.data;
            return this.props.data.filter(dataItem => (
                (dataItem.tags || [])
                    // Second argument to map sets `this`
                    .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                    .concat(dataItem.name.toLowerCase())
                    .join('\n') // unlikely to partially match newlines
                    .indexOf(this.state.filterQuery.toLowerCase()) !== -1
            ));
        }
        return this.props.data.filter(dataItem => (
            dataItem.tags &&
            dataItem.tags
                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                .indexOf(this.state.selectedTag) !== -1
        ));
    }
    scrollToTop () {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef (ref) {
        this.filteredDataRef = ref;
    }

    handleMenu (e) {
        e.preventDefault();
    }

    handleChangeEditStatus(){
        this.setState({
            isEdit: !this.state.isEdit
        })
    }
    
    handleUploadClose(){
        this.setState({uploadVisible: false});
    }

    handleUploadOpen(){
        this.setState({uploadVisible: true});
    }
    
    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                <div className={styles.main} onContextMenu={this.handleMenu}>
                {(this.props.filterable || this.props.tags) && (
                    <div className={styles.filterBar}>
                        {this.props.filterable && (
                            <Filter
                                className={classNames(
                                    styles.filterBarItem,
                                    styles.filter
                                )}
                                filterQuery={this.state.filterQuery}
                                inputClassName={styles.filterInput}
                                placeholderText={messages.filterPlaceholder}
                                onChange={this.handleFilterChange}
                                onClear={this.handleFilterClear}
                            />
                        )}
                        {this.props.tags &&
                            <div className={styles.tagWrapper}>
                                {tagListPrefix.concat(this.props.tags).map((tagProps, id) => (
                                    <TagButton
                                        active={this.state.selectedTag === tagProps.title.toLowerCase()}
                                        className={classNames(
                                            styles.tagButton,
                                            tagProps.className
                                        )}
                                        activeClass={classNames(
                                            styles.tagButtonActive
                                        )}
                                        key={`tag-button-${id}`}
                                        onClick={this.handleTagClick}
                                        {...tagProps}
                                    />
                                ))}
                            </div>
                        }
                    </div>
                )}
                    <div className={styles.libraryRightContainer}>
                        <div className={styles.libraryRightHeader}>
                            { rescourseType.map(item => {
                                return (
                                    <div
                                        key={item.value}
                                        onClick={()=>this.handleTypeClick(item.value)}
                                        className={classNames(
                                        styles.headerTag, 
                                        {[styles.headerTagActive]: this.state.selectedType == item.value})
                                    }
                                    >
                                        <img src={this.state.selectedType == item.value ? item.active : item.def}/>
                                        {item.label}
                                    </div>
                                )
                            })}
                            {
                                this.state.selectedType === '0' &&
                                <div className={styles.libraryEditBtn} onClick={this.handleChangeEditStatus}>
                                    <img src={libraryEditBtn} className={styles.libraryEditBtnImg}/>
                                    { this.state.isEdit ? '完成' : '编辑'}
                                </div>
                            }
                        </div>
                        <div
                            className={classNames(styles.libraryScrollGrid, {
                        [styles.withFilterBar]: this.props.filterable || this.props.tags
                    })}
                            ref={this.setFilteredDataRef}
                        >
                            {this.state.selectedType === '0' &&
                                <div className={styles.libraryUpload}
                                     onClick={this.handleUploadOpen}
                                >
                                    <img src={uploadBg} style={{width: '50%'}}/>
                                </div>
                            }
                            {this.getFilteredData().map((dataItem, index) => {
                                const scratchURL = dataItem.md5 ?
                                    `//cdn.imayuan.com/${dataItem.md5}` :
                                    dataItem.rawURL;
                                return (
                                    <LibraryItem
                                        description={dataItem.description}
                                        disabled={dataItem.disabled}
                                        featured={dataItem.featured}
                                        iconURL={scratchURL}
                                        id={index}
                                        key={`item_${index}`}
                                        name={dataItem.name}
                                        isEdit={this.state.isEdit}
                                        md5={dataItem.md5}
                                        onEdit={this.handleEdit}
                                        onDelete={this.handleDelete}
                                        onBlur={this.handleBlur}
                                        onFocus={this.handleFocus}
                                        onMouseEnter={this.handleMouseEnter}
                                        onMouseLeave={this.handleMouseLeave}
                                        onSelect={this.handleSelect}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    </div>
                <LibraryUpload
                    id={this.state.rescourseId}
                    type={this.props.type}
                    tags={this.props.tags}
                    visible={this.state.uploadVisible}
                    handleUploadClose={this.handleUploadClose}
                />
            </Modal>
        );
    }
}

LibraryComponent.propTypes = {
    data: PropTypes.arrayOf(
        /* eslint-disable react/no-unused-prop-types, lines-around-comment */
        // An item in the library
        PropTypes.shape({
            // @todo remove md5/rawURL prop from library, refactor to use storage
            md5: PropTypes.string,
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]).isRequired,
            rawURL: PropTypes.string
        })
        /* eslint-enable react/no-unused-prop-types, lines-around-comment */
    ),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired
};

LibraryComponent.defaultProps = {
    filterable: true
};

export default injectIntl(LibraryComponent);
