import PropTypes from 'prop-types';
import React from 'react';
import Box from '../../components/box/box.jsx';
import Button from '../../components/button/button.jsx';
import styles from './style.css';
import classNames from 'classnames';
import scratchLogo from '../../components/menu-bar/logo.png';
import dropdownCaret from '../../components/menu-bar/dropdown-caret.svg';
import MenuBarMenu from '../../components/menu-bar/menu-bar-menu.jsx';
import {MenuItem, MenuSection} from '../../components/menu/menu.jsx';


/**
 * 用户账户模块，对应界面右上角
 * @param props
 * @returns {*}
 * @constructor
 */

const AccountComponent = props => (
    <Box className={classNames(styles.menuBarItem)}>
        {props.account.userToken ? (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: props.accountMenuOpen
                })}
                onMouseUp={props.onOpenAccountMenu}
            >
                <div
                    className={classNames(styles.menuBarItem, styles.accountNavMenu)}
                >
                    <img
                        className={styles.profileIcon}
                        src={props.account.picUrl || scratchLogo}
                    />
                    <span>{props.account.nickname || 'mayuan'}</span>
                    <img
                        className={styles.dropdownCaretIcon}
                        src={dropdownCaret}
                    />
                </div>
                <MenuBarMenu
                    open={props.accountMenuOpen}
                    place="left"
                    onRequestClose={props.onCloseAccountMenu}
                >
                    <MenuSection>
                        <MenuItem onClick={props.onHandleLogout}>
                            退出
                        </MenuItem>
                    </MenuSection>
                </MenuBarMenu>
            </div>
        ) : (
            <div
                className={classNames(
                    styles.menuBarItem,
                    styles.hoverable,
                    styles.accountNavMenu
                )}
                onClick={props.onOpenLoginModal}
            >
                <img
                    className={styles.profileIcon}
                    src={scratchLogo}
                />
                <Button className={styles.login}>登录</Button>
            </div>
        )
        }

    </Box>
);

AccountComponent.propTypes = {
    account: PropTypes.shape({
        userToken: PropTypes.string,
        picUrl: PropTypes.string,
        nickname: PropTypes.string
    }),
    accountMenuOpen: PropTypes.bool,
    onCloseAccountMenu: PropTypes.func,
    onHandleLogout: PropTypes.func, // todo 处理退出登录
    onOpenAccountMenu: PropTypes.func,
    onOpenLoginModal: PropTypes.func
};

AccountComponent.defaultProps = {
    accountMenuOpen: false,
    onHandleLogout: () => {},
    // todo 用户账户reducer
    account: {
        userToken: '1234',
        picUrl: '',
        nickname: '哈哈哈'
    }

};

export default AccountComponent;
