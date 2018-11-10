import bindAll from 'lodash.bindall';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import styles from './library-item.css';
import classNames from 'classnames';
import editIcon from '../../lib/assets/edit-icon-white.png';
import deleteIcon from '../../lib/assets/delete-icon-white.png';

class LibraryItem extends React.PureComponent {
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
    handleDelete(e){
        this.props.onDelete(this.props.resourceId);
        e.stopPropagation();
    }
    handleEdit(e){
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
        return this.props.featured ? (
            <div
                className={classNames(
                    styles.libraryItem,
                    styles.featuredItem,
                    {
                        [styles.disabled]: this.props.disabled
                    }
                )}
                onClick={this.handleClick}
            >
                <div className={styles.featuredImageContainer}>
                    {this.props.disabled ? (
                        <div className={styles.comingSoonText}>
                            <FormattedMessage
                                defaultMessage="Coming Soon"
                                description="Label for extensions that are not yet implemented"
                                id="gui.extensionLibrary.comingSoon"
                            />
                        </div>
                    ) : null}
                    <img
                        className={styles.featuredImage}
                        src={this.props.iconURL}
                    />
                </div>
                <div
                    className={styles.featuredText}
                >
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                    <br />
                    <span className={styles.featuredDescription}>{this.props.description}</span>
                </div>
            </div>
        ) : (
            <Box
                className={styles.libraryItem}
                role="button"
                tabIndex="0"
                onClick={this.handleClick}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyPress={this.handleKeyPress}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {/* Layers of wrapping is to prevent layout thrashing on animation */}
                <Box className={styles.libraryItemImageContainerWrapper}>
                    <Box className={styles.libraryItemImageContainer}>
                        <img
                            className={styles.libraryItemImage}
                            src={this.props.iconURL}
                        />
                        {
                            this.props.isEdit &&
                            <Box className={styles.editArea}>
                                <Box className={styles.editItem} onClick={this.handleEdit}>
                                    <img className={styles.editItemImg} src={editIcon}/> 编辑
                                </Box>
                                <Box className={styles.editItem} onClick={this.handleDelete}>
                                    <img className={styles.editItemImg} src={deleteIcon}/> 删除
                                </Box>
                            </Box>
                        }
                    </Box>
                </Box>
                <span className={styles.libraryItemName}>{this.props.name}</span>
            </Box>
        );
    }
}

LibraryItem.propTypes = {
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    disabled: PropTypes.bool,
    featured: PropTypes.bool,
    iconURL: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
};

LibraryItem.defaultProps = {
    disabled: false
};

export default LibraryItem;
