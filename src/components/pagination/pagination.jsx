import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './pagination.css';

const PaginationComponent = ({
    nowPage,
    totalPage,
    getLast,
    getNext,
    ...props
}) => {
    return (
        <div>
            <span
                className={classNames(
                    styles.pageBtn,
                    (nowPage == 1 ?
                    styles.isDisabledBtn : styles.isUseabledBtn)
                )}
                onClick={getLast}
            >&lt;</span>
            <span className={styles.pageContainer}>{nowPage} 页 / {totalPage} 页</span>
            <span
                className={classNames(
                    styles.pageBtn,
                    (nowPage == totalPage || totalPage == 0 ?
                    styles.isDisabledBtn : styles.isUseabledBtn)
                )}
                onClick={getNext}
            >&gt;</span>
        </div>
    );
};

PaginationComponent.propTypes = {
    getLast: PropTypes.func,
    getNext: PropTypes.func,
    nowPage: PropTypes.number,
    totalPage: PropTypes.number
};

export default PaginationComponent;
