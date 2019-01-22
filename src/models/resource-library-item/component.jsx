import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import LazyLoad from 'react-lazy-load';
import Box from '../../components/box/box.jsx';
import styles from './style.css';
import classNames from 'classnames';
import editIcon from '../../lib/assets/resource-library/edit-icon-white.png';
import deleteIcon from '../../lib/assets/resource-library/delete-icon-white.png';
import soundIcon from '../../lib/assets/resource-library/sound-icon.png';

const SOUND_TYPE = 4;
class LibraryItemComponent extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleBlur',
            'handleClick',
            'handleFocus',
            'handleKeyPress',
            'handleMouseEnter',
            'handleMouseLeave',
            'handleEdit',
            'handleDelete'
        ]);
    }
    handleDelete (e){
        this.props.onDelete(this.props.resourceId);
        e.stopPropagation();
    }
    handleEdit (e){
        this.props.onEdit(this.props.resourceId);
        e.stopPropagation();
    }
    handleBlur () {
        this.props.onBlur(this.props.id);
    }
    handleFocus () {
        this.props.onFocus(this.props.id);
    }
    handleClick (e) {
        if (!this.props.disabled) {
            this.props.onSelect(this.props.id);
        }
        e.preventDefault();
    }
    handleKeyPress (e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.onSelect(this.props.id);
        }
    }
    handleMouseEnter () {
        this.props.onMouseEnter(this.props.id);
    }
    handleMouseLeave () {
        this.props.onMouseLeave(this.props.id);
    }
    render () {
        return (<Box
            className={styles.libraryItem}
            role="button"
            tabIndex="0"
            onBlur={this.handleBlur}
            onClick={this.handleClick}
            onFocus={this.handleFocus}
            onKeyPress={this.handleKeyPress}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
        >
            {/* Layers of wrapping is to prevent layout thrashing on animation */}
            <Box className={styles.libraryItemImageContainerWrapper}>
                <Box className={styles.libraryItemImageContainer}>
                    <LazyLoad
                        className={styles.libraryItemImageContainer}
                        height="100%"
                        width="100%"
                    >
                        <img
                            className={classNames(
                                {[styles.libraryItemBg]: this.props.type == 1},
                                {[styles.libraryItemImage]: this.props.type !== 1}
                            )}
                            crossOrigin="anonymous"
                            src={this.props.type === SOUND_TYPE ? soundIcon : this.props.iconURL}
                        />
                    </LazyLoad>
                    {
                        this.props.isEdit &&
                        <Box className={styles.editArea}>
                            <Box
                                className={styles.editItem}
                                onClick={this.handleEdit}
                            >
                                <img
                                    className={styles.editItemImg}
                                    src={editIcon}
                                /> 编辑
                            </Box>
                            <Box
                                className={styles.editItem}
                                onClick={this.handleDelete}
                            >
                                <img
                                    className={styles.editItemImg}
                                    src={deleteIcon}
                                /> 删除
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
            <span className={styles.libraryItemName}>{this.props.name}</span>
        </Box>);
    }
}

LibraryItemComponent.propTypes = {
    disabled: PropTypes.bool,
    iconURL: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isEdit: PropTypes.bool,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
    onBlur: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onFocus: PropTypes.func,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    resourceId: PropTypes.string,
};

LibraryItemComponent.defaultProps = {
    disabled: false
};

export default LibraryItemComponent;
