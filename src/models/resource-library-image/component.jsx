import PropTypes from 'prop-types';
import React from 'react';
import styles from './style.css';
import classNames from 'classnames';

const LibraryImage = props => (
    <div
        className={classNames(props.className, props.imageList.length ? '' : styles.boxHidden)}
    >
        {
            (props.imageList || []).map(item => (
                <div
                    className={styles.imgItem}
                    key={item.name}
                >
                    <img
                        className={styles.imgContent}
                        src={item.href}
                    />
                    <div
                        className={styles.imgDelete}
                        onClick={props.onHandleDel(item.name)}
                    />
                </div>
            ))
        }
    </div>
)

LibraryImage.propTypes = {
    className: PropTypes.string,
    imageList: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            href: PropTypes.string
        })
    ),
    onHandleDel: PropTypes.func
};

export default LibraryImage;
