import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import Cookies from 'universal-cookie';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import request ,{getTargetId,getQueryString} from '../lib/request';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {openExtensionLibrary} from '../reducers/modals';
import bindAll from 'lodash.bindall';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import {
    closeCostumeLibrary,
    closeBackdropLibrary
} from '../reducers/modals';

import ProjectLoaderHOC from '../lib/project-loader-hoc.jsx';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';
import {setWork} from "../reducers/scratch";

const cookies = new Cookies();

class GUI extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleBack'
        ]);
        this.state = {
            loading: !props.vm.initialized,
            loadingError: false,
            errorMessage: ''
        };
    }
    componentDidMount () {
        const id = getQueryString("id");
        const platFormId= getQueryString("platFormId") || "mayuan";
        const deviceIdentify = '1';
        const userToken= cookies.get("token");
        let nickname = 'mayuan' ,
            picUrl = '',
            userId = '';
        if(userToken){
            request.default_request(request.GET, null, `/api/getUserInfo`, result => {
                if(result.code == 0){
                    let work = {};
                    work.nickname = result.result.nickname || 'mayuan';
                    work.picUrl = result.result.cover || '';
                    work.userId = result.result.userId;
                    work.userToken = userToken;
                    this.props.setWork(work);
                }
            }, '//imayuan.com');
        }
        if (id !== null){
            request.default_request(request.GET, null, `/api/scratch/getWork?scratchId=${id}&deviceIdentify=${deviceIdentify}`, result => {
                let workData = {
                    userToken: userToken,
                    platFormId: platFormId
                };
                if (result.code !== request.NotFindError && result.result){
                    let res = result.result;
                    for(let x in res){
                        workData[x] = res[x];
                    }
                }
                this.props.setWork(workData);
            });
        }else{
            let workData = {
                userToken: userToken,
                platFormId: platFormId,
                userId: userId,
                nickname: nickname,
                picUrl: picUrl
            };
            this.props.setWork(workData);
        }
        window.sessionStorage.setItem("coverImg","");

        if (this.props.vm.initialized) return;
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.props.vm.loadProject(this.props.projectData)
            .then(() => {
                this.setState({loading: false}, () => {
                    this.props.vm.setCompatibilityMode(true);
                    this.props.vm.start();
                });
            })
            .catch(e => {
                // Need to catch this error and update component state so that
                // error page gets rendered if project failed to load
                this.setState({loadingError: true, errorMessage: e});
            });
        this.props.vm.initialized = true;
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.projectData !== nextProps.projectData) {
            this.setState({loading: true}, () => {
                this.props.vm.loadProject(nextProps.projectData)
                    .then(() => {
                        this.setState({loading: false});
                    })
                    .catch(e => {
                        // Need to catch this error and update component state so that
                        // error page gets rendered if project failed to load
                        this.setState({loadingError: true, errorMessage: e});
                    });
            });
        }
    }
    componentWillUnmount () {
        this.props.vm.stopAll();
    }
    handleBack (){
        // 返回上一页
        // console.log(window.history.length);
        // console.log(document.referrer); // 来源url
        if(window.history.length > 1 && document.referrer){
            window.history.go(-1);
        }else{
            return false;
        }
    }
    render () {
        if (this.state.loadingError) {
            throw new Error(
                `Failed to load project from server [id=${window.location.hash}]: ${this.state.errorMessage}`);
        }
        const {
            assetHost, // eslint-disable-line no-unused-vars
            children,
            fetchingProject,
            loadingStateVisible,
            projectData, // eslint-disable-line no-unused-vars
            projectHost, // eslint-disable-line no-unused-vars
            vm,
            setWork,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || this.state.loading || loadingStateVisible}
                vm={vm}
                handleBack={this.handleBack}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    assetHost: PropTypes.string,
    children: PropTypes.node,
    fetchingProject: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onSeeCommunity: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    saveModalVisible: PropTypes.bool,
    loginModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM),
    projectHost: PropTypes.string,
    setWork: PropTypes.func
};

const mapStateToProps = state => ({
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
    blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    cardsVisible: state.scratchGui.cards.visible,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    costumesTabVisible: state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
    importInfoVisible: state.scratchGui.modals.importInfo,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isRtl: state.locales.isRtl,
    loadingStateVisible: state.scratchGui.modals.loadingProject,
    previewInfoVisible: state.scratchGui.modals.previewInfo,
    saveModalVisible: state.scratchGui.modals.saveModal,
    loginModalVisible: state.scratchGui.modals.loginModal,
    workLibraryVisible: state.scratchGui.modals.workLibrary,
    targetIsStage: (
        state.scratchGui.targets.stage &&
        state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget
    ),
    soundsTabVisible: state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
    tipsLibraryVisible: state.scratchGui.modals.tipsLibrary,
    confirmVisibe: state.scratchGui.confirm.confirmConf.show,
    confirmType: state.scratchGui.confirm.confirmConf.type,
    confirmMessage: state.scratchGui.confirm.confirmConf.message,
    confirmStatus: state.scratchGui.confirm.confirmConf.status,
    confirmTimeout: state.scratchGui.confirm.confirmConf.timeout,
    confirmHandleSure: state.scratchGui.confirm.confirmConf.sure,
    work: state.scratchGui.scratch.work
});

const mapDispatchToProps = dispatch => ({
    setWork:work => {dispatch(setWork(work));},
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary())
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

const WrappedGui = ErrorBoundaryHOC('Top Level App')(
    ProjectLoaderHOC(vmListenerHOC(ConnectedGUI))
);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;
