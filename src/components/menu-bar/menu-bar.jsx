import classNames from 'classnames';
import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import ProjectLoader from '../../containers/project-loader.jsx';
import Menu from '../../containers/menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import ProjectSave from '../../containers/my/project-save.jsx';
import {openImportInfo, openTipsLibrary,openWorkLibrary, openSaveModal} from '../../reducers/modals';
import TurboMode from '../../containers/turbo-mode.jsx';

import {setPlayer} from '../../reducers/mode';
import {
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import feedbackIcon from './icon--feedback.svg';
import profileIcon from './icon--profile.png';
import communityIcon from './icon--see-community.svg';
import dropdownCaret from '../language-selector/dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './logo.png';


import backIcon from './icon--back.svg';
import {getHost} from '../../lib/request';

const host = getHost();
const newWork = function (){
    const r = confirm('离开前请确定作品已经保存');
    if (r === true) {
        window.location.href = `${host}/?userToken=${this.props.work.userToken}&platFormId=${this.props.work.platFormId}`;
    } else {
        return;
    }
};

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});
const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place="right"
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string
};

const MenuBarMenu = ({
    children,
    onRequestClose,
    open,
    place = 'right'
}) => (
    <Menu
        className={styles.menu}
        open={open}
        place={place}
        onRequestClose={onRequestClose}
    >
        {children}
    </Menu>
);

MenuBarMenu.propTypes = {
    children: PropTypes.node,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool,
    place: PropTypes.oneOf(['left', 'right'])
};
class MenuBar extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleLanguageMouseUp'
        ]);
    }
    handleLanguageMouseUp (e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    render () {
        return (
            <Box className={styles.menuBar}>
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <img
                                alt="阿尔法猿"
                                className={styles.scratchLogo}
                                draggable={false}
                                src={scratchLogo}
                            />
                        </div>
                        <ProjectSave />
                        <Divider className={classNames(styles.divider)} />
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, {
                                [styles.active]: this.props.fileMenuOpen
                            })}
                            onMouseUp={this.props.onClickFile}
                        >
                            <div className={classNames(styles.fileMenu)}>
                                文件
                            </div>
                            <MenuBarMenu
                                open={this.props.fileMenuOpen}
                                onRequestClose={this.props.onRequestCloseFile}
                            >
                                <MenuSection>
                                    <MenuItem onClick={newWork}>
                                        新建
                                    </MenuItem>
                                    <ProjectLoader>{(renderFileInput, loadProject, loadProps) => (
                                        <MenuItem
                                            onClick={loadProject}
                                            {...loadProps}
                                        >
                                            从电脑里打开
                                            {renderFileInput()}
                                        </MenuItem>
                                    )}</ProjectLoader>
                                    <ProjectSaver>{(saveProject, saveProps) => (
                                        <MenuItem
                                            onClick={saveProject}
                                            {...saveProps}
                                        >本地下载
                                        </MenuItem>
                                    )}</ProjectSaver>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                        <div className={classNames(styles.menuBarItem)}>
                            <Button
                                className={classNames(styles.shareButton)}
                                onClick={this.props.onOpenSaveModal}
                            >
                                作品发布
                            </Button>
                        </div>

                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, {
                                [styles.active]: this.props.editMenuOpen
                            })}
                            onMouseUp={this.props.onClickEdit}
                        >
                            <div className={classNames(styles.editMenu)}>
                               编辑
                            </div>
                            <MenuBarMenu
                                open={this.props.editMenuOpen}
                                onRequestClose={this.props.onRequestCloseEdit}
                            >
                                <MenuItemTooltip id="undo">
                                    <MenuItem>
                                        <FormattedMessage
                                            defaultMessage="Undo"
                                            description="Menu bar item for undoing"
                                            id="gui.menuBar.undo"
                                        />
                                    </MenuItem>
                                </MenuItemTooltip>
                                <MenuItemTooltip id="redo">
                                    <MenuItem>
                                        <FormattedMessage
                                            defaultMessage="Redo"
                                            description="Menu bar item for redoing"
                                            id="gui.menuBar.redo"
                                        />
                                    </MenuItem>
                                </MenuItemTooltip>
                                <MenuSection>
                                    <TurboMode>{(toggleTurboMode, {turboMode}) => (
                                        <MenuItem onClick={toggleTurboMode}>
                                            {turboMode ? (
                                                "开启加速"
                                            ) : (
                                                "关闭加速"
                                            )}
                                        </MenuItem>
                                    )}</TurboMode>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.mystuffButton
                        )}
                        onClick={this.props.handleBack}
                    >
                        <img
                            className={styles.myBackIcon}
                            src={backIcon}
                            title="返回"
                        />
                    </div>
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            styles.mystuffButton
                        )}
                        onClick={this.props.onOpenWorkLibrary}
                    >
                        <img
                            className={styles.mystuffIcon}
                            src={mystuffIcon}
                            title="我的作品库"
                        />
                    </div>
                    <div
                        aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                        className={classNames(styles.menuBarItem, styles.hoverable)}
                        onClick={this.props.onOpenTipLibrary}
                    >
                        <img
                            className={styles.helpIcon}
                            src={helpIcon}
                        />
                        <FormattedMessage {...ariaMessages.tutorials} />
                    </div>
                    <Divider className={classNames(styles.divider)} />
                </div>
                {/*<div className={classNames(styles.menuBarItem, styles.feedbackButtonWrapper)}>*/}
                    {/*<a*/}
                        {/*className={styles.feedbackLink}*/}
                        {/*href="https://scratch.mit.edu/discuss/57/"*/}
                        {/*rel="noopener noreferrer"*/}
                        {/*target="_blank"*/}
                    {/*>*/}
                        {/*<Button*/}
                            {/*className={styles.feedbackButton}*/}
                            {/*iconSrc={feedbackIcon}*/}
                        {/*>*/}
                            {/*<FormattedMessage*/}
                                {/*defaultMessage="Give Feedback"*/}
                                {/*description="Label for feedback form modal button"*/}
                                {/*id="gui.menuBar.giveFeedback"*/}
                            {/*/>*/}
                        {/*</Button>*/}
                    {/*</a>*/}
                {/*</div>*/}
                <div className={styles.accountInfoWrapper}>
                    <MenuBarItemTooltip id="mystuff">
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.mystuffButton
                            )}
                        >
                            <img
                                className={styles.mystuffIcon}
                                src={mystuffIcon}
                            />
                        </div>
                    </MenuBarItemTooltip>
                    <MenuBarItemTooltip
                        id="account-nav"
                        place="left"
                    >
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.accountNavMenu
                            )}
                        >
                            <img
                                className={styles.profileIcon}
                                src={profileIcon}
                            />
                            <span>
                                {'scratch-cat' /* @todo username */}
                            </span>
                            <img
                                className={styles.dropdownCaretIcon}
                                src={dropdownCaret}
                            />
                        </div>
                    </MenuBarItemTooltip>
                </div>
            </Box>
        );
    }
}

MenuBar.propTypes = {
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    languageMenuOpen: PropTypes.bool,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onOpenSaveModal: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onOpenWorkLibrary: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onViewProject: PropTypes.func,
    work: PropTypes.object
};

const mapStateToProps = state => ({
    work: state.scratchGui.scratch.work,
    fileMenuOpen: fileMenuOpen(state),
    editMenuOpen: editMenuOpen(state),
    languageMenuOpen: languageMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
    onOpenWorkLibrary: () => dispatch(openWorkLibrary()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onViewProject: () => {
        dispatch(openImportInfo());
    },
    onOpenSaveModal: () => {
        dispatch(openSaveModal());
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar));
