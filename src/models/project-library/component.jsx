import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import LibraryItem from '../project-library-item/container.jsx';
import Modal from '../../components/modal/modal.jsx';
import Filter from '../../components/filter/filter.jsx';
import styles from './style.css';
import classNames from 'classnames';
import TagButton from '../../containers/tag-button.jsx';
import Pagination from '../pagination/container.jsx';


const ALL_TAG_TITLE = '所有';
const tagListPrefix = [
    {id: 0, title: ALL_TAG_TITLE}
];

const messages = {
    filterPlaceholder: '搜索'
};

class ProjectLibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTagClick'
        ]);

    }

    handleTagClick (tag){
        this.props.onHandleTagClick(tag);
    }

    render () {
        return (
            <Modal
                fullScreen
                contentLabel={'我的作品库'}
                filterQuery={''}
                onRequestClose={this.props.onRequestClose}
            >
                <div className={styles.main}>
                    {(this.props.filterable || this.props.tags) && (
                        <div className={styles.filterBar}>
                            {this.props.filterable && (
                                <Filter
                                    className={classNames(
                                        styles.filterBarItem,
                                        styles.filter
                                    )}
                                    filterQuery={this.props.filterQuery}
                                    inputClassName={styles.filterInput}
                                    placeholderText={messages.filterPlaceholder}
                                    onChange={this.props.onHandleFilterChange}
                                    onClear={this.props.onHandleFilterClear}
                                    onKeyDown={this.props.onHandleFilterKeyDown}
                                />
                            )}
                            {this.props.tags &&
                                <div className={styles.tagWrapper}>
                                    {tagListPrefix.concat(this.props.tags).map((tagProps, id) => (
                                        <TagButton
                                            active={tagProps.active}
                                            className={classNames(
                                                styles.filterBarItem,
                                                styles.tagButton,
                                                tagProps.className
                                            )}
                                            key={`tag-button-${id}`}
                                            tag={tagProps.title}
                                            title={tagProps.title}
                                            onClick={this.handleTagClick}
                                            {...tagProps}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                    )}
                    <div
                        className={classNames(styles.libraryScrollGrid, {
                            [styles.withFilterBar]: this.props.filterable || this.props.tags
                        })}
                        ref={this.setFilteredDataRef}
                    >
                        {this.props.data.map((dataItem, index) => {
                            const scratchURL = dataItem.cover ?
                                `${dataItem.cover}` : `//cdn.imayuan.com/b579aeeb143e79c47e2e65cbd3c0fe36.svg`;
                            return (
                                <LibraryItem
                                    datetime={dataItem.createTime ? dataItem.createTime.substring(0, 10) : ''}
                                    iconURL={scratchURL}
                                    id={dataItem.id}
                                    key={index}
                                    name={dataItem.name}
                                    onDelete={this.props.onDelete}
                                />);
                        })
                        }
                        <div className={styles.pagesBox}>
                            <Pagination
                                getLast={this.props.getLast}
                                getNext={this.props.getNext}
                                nowPage={this.props.nowPage}
                                totalPage={this.props.totalPage}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

ProjectLibraryComponent.propTypes = {
    data: PropTypes.arrayOf(
        // An item in the library
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            cover: PropTypes.string,
            createDate: PropTypes.string
        })
    ),
    filterQuery: PropTypes.string,
    filterable: PropTypes.bool,
    getLast: PropTypes.func,
    getNext: PropTypes.func,
    nowPage: PropTypes.number,
    onDelete: PropTypes.func,
    onHandleFilterChange: PropTypes.func,
    onHandleFilterClear: PropTypes.func,
    onHandleFilterKeyDown: PropTypes.func,
    onHandleTagClick: PropTypes.func,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    tags: PropTypes.arrayOf(
        PropTypes.shape(
            {
                active: PropTypes.bool,
                id: PropTypes.string,
                title: PropTypes.string
            }
        )
    ),
    totalPage: PropTypes.number
};

ProjectLibraryComponent.defaultProps = {
    filterable: true
};

export default ProjectLibraryComponent;
