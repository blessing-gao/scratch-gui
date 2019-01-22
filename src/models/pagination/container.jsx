import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import PaginationComponent from './component.jsx';

class Pagination extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this, [

        ]);
    }

    render (){
        return (
            <PaginationComponent
                {...this.props}
            />
        );
    }
}

Pagination.propTypes = {
    getLast: PropTypes.func,
    getNext: PropTypes.func,
    nowPage: PropTypes.number,
    totalPage: PropTypes.number
};

export default Pagination;
