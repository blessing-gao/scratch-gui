import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './library-image.css';
import classNames from 'classnames';


class LibraryImage extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this,[
            'handleDel'
        ]);
        this.state = {

        }
    }

    handleDel(name){
        this.props.handleDel(name);
    }

    componentDidMount(){

    }

    render (){
        let {imageList, className} = this.props;
        return (
            <div className={
                classNames(className,
                !imageList.length ? styles.boxHidden : ''
            )}>
                {
                    (imageList || []).map(item => {
                        return (
                            <div className={styles.imgItem} key={item.name}>
                                <img className={styles.imgContent} src={item.href}/>
                                <div className={styles.imgDelete}
                                     onClick={this.handleDel.bind(this,item.name)}
                                ></div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

LibraryImage.propTypes = {
    imageList: PropTypes.array,
    handleDel: PropTypes.func
};

export default LibraryImage;
