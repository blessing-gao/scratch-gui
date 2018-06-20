import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLibraryItem from './work-library-item.jsx';
import ModalComponent from '../modal/modal.jsx';
import styles from './work-library.css';
import {COVER_SERVER} from '../../lib/request';

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
                <div className={styles.libraryScrollGrid}>
                    {this.props.data.map((dataItem, index) => {
                        /*
                             * todo 后期如果需要可添加默认图片地址
                             * https://cdn.assets.scratch.mit.edu/internalapi/asset/${dataItem.md5}/get/` : dataItem.rawURL;
                             */
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
    onRequestClose: PropTypes.func,
    onDelete: PropTypes.func,
    title: PropTypes.string.isRequired
};

export default WorkLibraryComponent;
