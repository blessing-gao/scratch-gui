import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {setWork} from '../reducers/scratch';
import request from '../lib/request';
import PaginationComponent from '../components/pagination/pagination.jsx'

class Pagination extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this,[

        ]);
    }

    render (){
        return (
            <PaginationComponent
                getLast={this.props.getLast}
                getNext={this.props.getNext}
                nowPage={this.props.nowPage}
                totalPage={this.props.totalPage}
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
