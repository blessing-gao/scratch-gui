import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {setWork} from '../reducers/scratch';
import request from '../lib/request';
import paginationComponent from '../components/pagination/pagination'

class pagination extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this,[
            'getLastPage',
            'getNextPage'
        ]);
        this.state = {
            nowPage : 1
        };
    }

    render (){
        return (
            <paginationComponent />
        );
    }
}

export default pagination;
