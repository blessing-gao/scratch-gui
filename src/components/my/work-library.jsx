import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLibraryItem from './work-library-item.jsx';
import ModalComponent from '../modal/modal.jsx';
import styles from './work-library.css';
import {COVER_SERVER} from '../../lib/request';
import classNames from "classnames";
import {intlShape} from "react-intl";

class WorkLibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
    }
    render () {
        return (
            <ModalComponent
                className={styles.modalContent}
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
                                placeholderText={this.props.intl.formatMessage(messages.filterPlaceholder)}
                                onChange={this.handleFilterChange}
                                onClear={this.handleFilterClear}
                            />
                        )}
                        {this.props.filterable && this.props.tags && (
                            <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                        )}
                    </div>
                )}
                <div
                    className={classNames(styles.libraryScrollGrid, {
                        [styles.withFilterBar]: this.props.filterable || this.props.tags
                    })}
                    ref={this.setFilteredDataRef}
                >
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

export default WorkLibraryComponent;
