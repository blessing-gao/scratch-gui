import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLibraryItem from './work-library-item.jsx';
import ModalComponent from '../modal/modal.jsx';
import styles from './work-library.css';
import {COVER_SERVER} from '../../lib/request';
import classNames from "classnames";
import {intlShape, injectIntl, defineMessages} from "react-intl";
import TagButton from '../../containers/tag-button.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';

const ALL_TAG_TITLE = '所有';
const tagListPrefix = [{id: 0, title: ALL_TAG_TITLE}];

const messages = {
    filterPlaceholder: '搜索',
};

class WorkLibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
        this.state = {
            selectedItem: null,
            filterQuery: '',
            selectedTag: ALL_TAG_TITLE,
            selectedType: '1'
        };
    }
    render () {
        return (
            <ModalComponent
                fullScreen
                contentLabel={this.props.title}
                filterQuery={''}
                onRequestClose={this.props.onRequestClose}
            >
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
                        {this.props.filterable && this.props.tags && (
                            <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                        )}
                        {this.props.tags &&
                        <div className={styles.tagWrapper}>
                            {tagListPrefix.concat(this.props.tags).map((tagProps, id) => (
                                <TagButton
                                    active={this.state.selectedTag === tagProps.title.toLowerCase()}
                                    className={classNames(
                                            styles.filterBarItem,
                                            styles.tagButton,
                                            tagProps.className
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
                <div
                    className={classNames(styles.libraryScrollGrid, {
                        [styles.withFilterBar]: this.props.filterable || this.props.tags
                    })}
                    ref={this.setFilteredDataRef}
                >
                        {this.props.data.map((dataItem, index) => {
                            const scratchURL = dataItem.cover ?
                                `${COVER_SERVER}${dataItem.cover}` : `http://cdn.imayuan.com/b579aeeb143e79c47e2e65cbd3c0fe36.svg`;
                            return (
                                <WorkLibraryItem
                                    datetime={dataItem.createDate}
                                    iconURL={scratchURL}
                                    id={dataItem.id}
                                    key={index}
                                    name={dataItem.name}
                                    onDelete={this.props.onDelete}
                                />);
                        })
                        }
                </div>
                {/*<div className={styles.filterBar}>*/}
                    {/*{this.props.data.map((dataItem, index) => {*/}
                        {/*/**/}
                             {/** 后期如果需要可添加默认图片地址*/}
                             {/** https://cdn.assets.scratch.mit.edu/internalapi/asset/${dataItem.md5}/get/` : dataItem.rawURL;*/}
                             {/**/}
                        {/*const scratchURL = dataItem.cover ?*/}
                            {/*`${COVER_SERVER}${dataItem.cover}` : `http://cdn.imayuan.com/b579aeeb143e79c47e2e65cbd3c0fe36.svg`;*/}
                        {/*return (*/}
                            {/*<WorkLibraryItem*/}
                                {/*datetime={dataItem.createDate}*/}
                                {/*iconURL={scratchURL}*/}
                                {/*id={dataItem.id}*/}
                                {/*key={index}*/}
                                {/*name={dataItem.name}*/}
                                {/*onDelete={this.props.onDelete}*/}
                            {/*/>);*/}
                    {/*})*/}
                    {/*}*/}

                {/*</div>*/}
            </ModalComponent>
        );
    }
}

WorkLibraryComponent.propTypes = {
    data: PropTypes.arrayOf(
        /* eslint-disable react/no-unused-prop-types, lines-around-comment */
        // An item in the library
        PropTypes.shape({
            // @todo remove md5/rawURL prop from library, refactor to use storage
            id: PropTypes.string,
            name: PropTypes.string,
            cover: PropTypes.string,
            createDate: PropTypes.string
        })
        /* eslint-enable react/no-unused-prop-types, lines-around-comment */
    ),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onDelete: PropTypes.func,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired
};

WorkLibraryComponent.defaultProps = {
    filterable: true
};

export default injectIntl(WorkLibraryComponent);
