import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';

import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';

import soundIcon from '../components/asset-panel/icon--sound.svg';

import soundLibraryContent from '../lib/libraries/sounds.json';
import soundTags from '../lib/libraries/sound-tags';
import request from '../lib/request';


class SoundLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelected',
            'handleItemMouseEnter',
            'handleItemMouseLeave',
            'handleChange',
            'getResource',
            'getDefault',
            'getType'
        ]);
        this.state = {
            sound: [],
            tags: null
        };

        /**
         * AudioEngine that will decode and play sounds for us.
         * @type {AudioEngine}
         */
        this.audioEngine = null;
        /**
         * A promise for the sound queued to play as soon as it loads and
         * decodes.
         * @type {Promise<SoundPlayer>}
         */
        this.playingSoundPromise = null;
    }

    getDefault (){
        request.default_request(request.GET, null, '/backdrops.json', result => {
            if (result) {
                this.setState({sound: result});
            }
        },'http://owkomi1zd.bkt.clouddn.com');
    }

    handleChange (type){
        // 课程素材{type=1},默认素材{type=2}切换
        if(type == 1){
            this.getResource(1,1,1,4);
        }else {
            this.getDefault();
        }
    }

    getResource (type, platFormId, userToken, typeId){
        request.default_request(request.GET, null, `/api/scratch/getResByType?type=${type}&platFormId=${platFormId}&userToken=${userToken}&typeId=${typeId}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                this.setState({sound: result.result});
            }
        });
    }

    getType (type, platFormId, userToken){
        request.default_request(request.GET, null, `/api/scratch/type?type=${type}&platFormId=${platFormId}&userToken=${userToken}`, result => {
            if (result.code !== request.NotFindError && result.result) {
                let tags = [];
                result.result.map(tag => {
                    tags.push({id:tag.id,title:tag.name});
                });
                this.setState({tags:tags});
            }
        });
    }

    componentDidMount () {
        this.getType(4,1,1);    // 获取类别 type, platFormId, userToken
        this.getResource(1,1,1,4);    // 获取素材 type, platFormId, userToken, typeId
        this.audioEngine = new AudioEngine();
        this.playingSoundPromise = null;
    }

    componentWillUnmount () {
        this.stopPlayingSound();
    }
    stopPlayingSound () {
        // Playback is queued, playing, or has played recently and finished
        // normally.
        if (this.playingSoundPromise !== null) {
            // Queued playback began playing before this method.
            if (this.playingSoundPromise.isPlaying) {
                // Fetch the player from the promise and stop playback soon.
                this.playingSoundPromise.then(soundPlayer => {
                    soundPlayer.stop();
                });
            } else {
                // Fetch the player from the promise and stop immediately. Since
                // the sound is not playing yet, this callback will be called
                // immediately after the sound starts playback. Stopping it
                // immediately will have the effect of no sound being played.
                this.playingSoundPromise.then(soundPlayer => {
                    soundPlayer.stopImmediately();
                });
            }
            // No further work should be performed on this promise and its
            // soundPlayer.
            this.playingSoundPromise = null;
        }
    }
    handleItemMouseEnter (soundItem) {
        const md5ext = soundItem._md5;
        const idParts = md5ext.split('.');
        const md5 = idParts[0];
        const vm = this.props.vm;

        // In case enter is called twice without a corresponding leave
        // inbetween, stop the last playback before queueing a new sound.
        this.stopPlayingSound();

        // Save the promise so code to stop the sound may queue the stop
        // instruction after the play instruction.
        this.playingSoundPromise = vm.runtime.storage.load(vm.runtime.storage.AssetType.Sound, md5)
            .then(soundAsset => {
                const sound = {
                    md5: md5ext,
                    name: soundItem.name,
                    format: soundItem.format,
                    data: soundAsset.data
                };
                return this.audioEngine.decodeSoundPlayer(sound);
            })
            .then(soundPlayer => {
                soundPlayer.connect(this.audioEngine);
                // Play the sound. Playing the sound will always come before a
                // paired stop if the sound must stop early.
                soundPlayer.play();
                // Set that the sound is playing. This affects the type of stop
                // instruction given if the sound must stop early.
                if (this.playingSoundPromise !== null) {
                    this.playingSoundPromise.isPlaying = true;
                }
                return soundPlayer;
            });
    }
    handleItemMouseLeave () {
        this.stopPlayingSound();
    }
    handleItemSelected (soundItem) {
        const vmSound = {
            format: soundItem.format,
            md5: soundItem._md5,
            rate: soundItem.rate,
            sampleCount: soundItem.sampleCount,
            name: soundItem.name
        };
        this.props.vm.addSound(vmSound).then(() => {
            this.props.onNewSound();
        });
        analytics.event({
            category: 'library',
            action: 'Select Sound',
            label: soundItem.name
        });
    }
    render () {
        // @todo need to use this hack to avoid library using md5 for image
        // const soundLibraryThumbnailData = soundLibraryContent.map(sound => {
        //     const {
        //         md5,
        //         ...otherData
        //     } = sound;
        //     return {
        //         _md5: md5,
        //         rawURL: soundIcon,
        //         ...otherData
        //     };
        // });

        const soundLibraryThumbnailData = this.state.sound.map(sound => {
            const {
                md5,
                ...otherData
            } = sound;
            return {
                _md5: md5,
                rawURL: soundIcon,
                ...otherData
            };
        });

        return (
            <LibraryComponent
                data={soundLibraryThumbnailData}
                id="soundLibrary"
                tags={this.state.tags}
                title="选择声音"
                onItemMouseEnter={this.handleItemMouseEnter}
                onItemMouseLeave={this.handleItemMouseLeave}
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
                onTabChange={this.handleChange}
            />
        );
    }
}

SoundLibrary.propTypes = {
    onNewSound: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default SoundLibrary;
