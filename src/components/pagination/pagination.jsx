import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from 'pagination.css';

const PaginationComponent = ({
    nowPage,
    totalPage,
    getLastPage,
    getNextPage,
    ...props
}) => {
    return (
        <div>
            <button onclick={getLastPage}>上一页</button>
            <span>{nowPage}页/{totalPage}页</span>
            <button onclick={getNextPage}>下一页</button>
        </div>
    );
};

export default PaginationComponent;
