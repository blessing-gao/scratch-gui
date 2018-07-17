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
import ProjectLoader from '../../containers/project-loader.jsx';
import Menu from '../../containers/menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import ProjectSave from '../../containers/my/project-save.jsx';
import {closePreviewInfo, openImportInfo, openTipsLibrary,openWorkLibrary, openSaveModal} from '../../reducers/modals';
import {setPlayer} from '../../reducers/mode';
import {
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    languageMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import dropdownCaret from '../language-selector/dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './logo.png';

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

const MenuBar = props => (
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
                        [styles.active]: props.fileMenuOpen
                    })}
                    onMouseUp={props.onClickFile}
                >
                    <div className={classNames(styles.fileMenu)}>
                        文件
                    </div>
                    <MenuBarMenu
                        open={props.fileMenuOpen}
                        onRequestClose={props.onRequestCloseFile}
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
                {/* <div*/}
                {/* className={classNames(styles.menuBarItem, styles.hoverable, {*/}
                {/* [styles.active]: props.editMenuOpen*/}
                {/* })}*/}
                {/* onMouseUp={props.onClickEdit}*/}
                {/* >*/}
                {/* <div className={classNames(styles.editMenu)}>*/}
                {/* <FormattedMessage*/}
                {/* defaultMessage="Edit"*/}
                {/* description="Text for edit dropdown menu"*/}
                {/* id="gui.menuBar.edit"*/}
                {/* />*/}
                {/* </div>*/}
                {/* <MenuBarMenu*/}
                {/* open={props.editMenuOpen}*/}
                {/* onRequestClose={props.onRequestCloseEdit}*/}
                {/* >*/}
                {/* <MenuItemTooltip id="undo">*/}
                {/* <MenuItem>*/}
                {/* <FormattedMessage*/}
                {/* defaultMessage="Undo"*/}
                {/* description="Menu bar item for undoing"*/}
                {/* id="gui.menuBar.undo"*/}
                {/* />*/}
                {/* </MenuItem>*/}
                {/* </MenuItemTooltip>*/}
                {/* <MenuItemTooltip id="redo">*/}
                {/* <MenuItem>*/}
                {/* <FormattedMessage*/}
                {/* defaultMessage="Redo"*/}
                {/* description="Menu bar item for redoing"*/}
                {/* id="gui.menuBar.redo"*/}
                {/* />*/}
                {/* </MenuItem>*/}
                {/* </MenuItemTooltip>*/}
                {/* <MenuSection>*/}
                {/* <MenuItemTooltip id="turbo">*/}
                {/* <MenuItem>*/}
                {/* <FormattedMessage*/}
                {/* defaultMessage="Turbo mode"*/}
                {/* description="Menu bar item for toggling turbo mode"*/}
                {/* id="gui.menuBar.turboMode"*/}
                {/* />*/}
                {/* </MenuItem>*/}
                {/* </MenuItemTooltip>*/}
                {/* </MenuSection>*/}
                {/* </MenuBarMenu>*/}
                {/* </div>*/}
                {/* </div>*/}
                <div className={classNames(styles.menuBarItem)}>
                    <Button
                        className={classNames(styles.shareButton)}
                        onClick={props.onOpenSaveModal}
                    >
                    作品发布
                    </Button>
                </div>
                {/*<div className={classNames(styles.menuBarItem)}>*/}
                    {/*<Button*/}
                        {/*className={classNames(styles.shareButton)}*/}
                        {/*title="viewproject"*/}
                        {/*onClick={props.onViewProject}*/}
                    {/*>*/}
                   {/*查看2.0项目*/}
                    {/*</Button>*/}
                {/*</div>*/}
                <Divider className={classNames(styles.divider)} />

                {/* <div className={classNames(styles.menuBarItem, styles.communityButtonWrapper)}>*/}
                {/* {props.enableCommunity ?*/}
                {/* <Button*/}
                {/* className={classNames(styles.communityButton)}*/}
                {/* iconClassName={styles.communityButtonIcon}*/}
                {/* iconSrc={communityIcon}*/}
                {/* onClick={props.onSeeCommunity}*/}
                {/* >*/}
                {/* <FormattedMessage*/}
                {/* defaultMessage="See Community"*/}
                {/* description="Label for see community button"*/}
                {/* id="gui.menuBar.seeCommunity"*/}
                {/* />*/}
                {/* </Button> :*/}
                {/* <MenuBarItemTooltip id="community-button">*/}
                {/* <Button*/}
                {/* className={classNames(styles.communityButton)}*/}
                {/* iconClassName={styles.communityButtonIcon}*/}
                {/* iconSrc={communityIcon}*/}
                {/* >*/}
                {/* <FormattedMessage*/}
                {/* defaultMessage="See Community"*/}
                {/* description="Label for see community button"*/}
                {/* id="gui.menuBar.seeCommunity"*/}
                {/* />*/}
                {/* </Button>*/}
                {/* </MenuBarItemTooltip>*/}
                {/* }*/}
                {/* </div>*/}
            </div>
        </div>
        {/* <div className={classNames(styles.menuBarItem, styles.feedbackButtonWrapper)}>*/}
        {/* <a*/}
        {/* className={styles.feedbackLink}*/}
        {/* href="https://scratch.mit.edu/discuss/topic/299791/"*/}
        {/* rel="noopener noreferrer"*/}
        {/* target="_blank"*/}
        {/* >*/}
        {/* <Button*/}
        {/* className={styles.feedbackButton}*/}
        {/* iconSrc={feedbackIcon}*/}
        {/* >*/}
        {/* <FormattedMessage*/}
        {/* defaultMessage="Give Feedback"*/}
        {/* description="Label for feedback form modal button"*/}
        {/* id="gui.menuBar.giveFeedback"*/}
        {/* />*/}
        {/* </Button>*/}
        {/* </a>*/}
        {/* </div>*/}
        <div className={styles.accountInfoWrapper}>
            <div
                className={classNames(
                    styles.menuBarItem,
                    styles.hoverable,
                    styles.mystuffButton
                )}
                onClick={props.handleBack}
            >
                <img
                    className={styles.myBackIcon}
                    src={backIcon}
                    title="返回"
                />
            </div>
            <div
                aria-label="How-to Library"
                className={classNames(styles.menuBarItem, styles.hoverable)}
                onClick={props.onOpenTipLibrary}
            >
                <img
                    className={styles.helpIcon}
                    src={helpIcon}
                    title="帮助"
                />
            </div>
            <div
                className={classNames(
                    styles.menuBarItem,
                    styles.hoverable,
                    styles.mystuffButton
                )}
                onClick={props.onOpenWorkLibrary}
            >
                <img
                    className={styles.mystuffIcon}
                    src={mystuffIcon}
                    title="我的作品库"
                />
            </div>
            {/*<div*/}
                {/*className={classNames(*/}
                    {/*styles.menuBarItem,*/}
                    {/*styles.hoverable,*/}
                    {/*styles.accountNavMenu*/}
                {/*)}*/}
            {/*>*/}
                {/*<img*/}
                    {/*className={styles.profileIcon}*/}
                    {/*src={profileIcon}*/}
                {/*/>*/}
                {/*<span>*/}
                    {/*{'阿尔法猿'}*/}
                {/*</span>*/}
                {/*<img*/}
                    {/*className={styles.dropdownCaretIcon}*/}
                    {/*src={dropdownCaret}*/}
                {/*/>*/}
            {/*</div>*/}
        </div>
    </Box>
);

MenuBar.propTypes = {
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
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
    editMenuOpen: editMenuOpen(state)
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
