import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './style.css';

const PaginationComponent = props => (
    <div>
        <span
            className={classNames(
                styles.pageBtn,
                (props.nowPage == 1 ? styles.isDisabledBtn : styles.isUseabledBtn)
            )}
            onClick={props.getLast}
        >&lt;</span>
        <span className={styles.pageContainer}>{props.nowPage} 页 / {props.totalPage} 页</span>
        <span
            className={classNames(
                styles.pageBtn,
                (props.nowPage == props.totalPage || props.totalPage == 0 ? styles.isDisabledBtn : styles.isUseabledBtn)
            )}
            onClick={props.getNext}
        >&gt;</span>
    </div>
);

PaginationComponent.propTypes = {
    getLast: PropTypes.func,
    getNext: PropTypes.func,
    nowPage: PropTypes.number,
    totalPage: PropTypes.number
};

export default PaginationComponent;
