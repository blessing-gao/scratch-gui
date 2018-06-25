import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Waveform from '../waveform/waveform.jsx';
import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import AudioTrimmer from '../../containers/audio-trimmer.jsx';
import IconButton from '../icon-button/icon-button.jsx';

import styles from './sound-editor.css';

import playIcon from '../record-modal/icon--play.svg';
import stopIcon from '../record-modal/icon--stop-playback.svg';
import trimIcon from './icon--trim.svg';
import trimConfirmIcon from './icon--trim-confirm.svg';
import redoIcon from './icon--redo.svg';
import undoIcon from './icon--undo.svg';
import echoIcon from './icon--echo.svg';
import fasterIcon from './icon--faster.svg';
import slowerIcon from './icon--slower.svg';
import louderIcon from './icon--louder.svg';
import softerIcon from './icon--softer.svg';
import robotIcon from './icon--robot.svg';
import reverseIcon from './icon--reverse.svg';

const BufferedInput = BufferedInputHOC(Input);

const messages = {
    sound: '声音',
    play:  '播放',
    stop: '停止',
    trim: '裁剪',
    save: '保存',
    undo: '撤销',
    redo: '重置',
    faster: '加速',
    slower: '减速',
    echo: '回声',
    robot: '机器声',
    louder: '音量+',
    softer: '音量-',
    reverse: '反向'
};

const SoundEditor = props => (
    <div className={styles.editorContainer}>
        <div className={styles.row}>
            <div className={styles.inputGroup}>
                <Label text={messages.sound}>
                    <BufferedInput
                        tabIndex="1"
                        type="text"
                        value={props.name}
                        onSubmit={props.onChangeName}
                    />
                </Label>
                <div className={styles.buttonGroup}>
                    <button
                        className={styles.button}
                        disabled={!props.canUndo}
                        title={messages.undo}
                        onClick={props.onUndo}
                    >
                        <img
                            draggable={false}
                            src={undoIcon}
                        />
                    </button>
                    <button
                        className={styles.button}
                        disabled={!props.canRedo}
                        title={messages.redo}
                        onClick={props.onRedo}
                    >
                        <img
                            draggable={false}
                            src={redoIcon}
                        />
                    </button>
                </div>
            </div>
            <IconButton
                className={classNames(styles.trimButton, {
                    [styles.trimButtonActive]: props.trimStart !== null
                })}
                img={props.trimStart === null ? trimIcon : trimConfirmIcon}
                title={props.trimStart === null ? (
                    messages.trim
                ) : (
                    messages.save
                )}
                onClick={props.onActivateTrim}
            />
        </div>
        <div className={styles.row}>
            <div className={styles.waveformContainer}>
                <Waveform
                    data={props.chunkLevels}
                    height={160}
                    width={600}
                />
                <AudioTrimmer
                    playhead={props.playhead}
                    trimEnd={props.trimEnd}
                    trimStart={props.trimStart}
                    onSetTrimEnd={props.onSetTrimEnd}
                    onSetTrimStart={props.onSetTrimStart}
                />
            </div>
        </div>
        <div className={styles.row}>
            <div className={styles.inputGroup}>
                {props.playhead ? (
                    <button
                        className={classNames(styles.roundButton, styles.stopButtonn)}
                        title={messages.stop}
                        onClick={props.onStop}
                    >
                        <img
                            draggable={false}
                            src={stopIcon}
                        />
                    </button>
                ) : (
                    <button
                        className={classNames(styles.roundButton, styles.playButton)}
                        title={messages.play}
                        onClick={props.onPlay}
                    >
                        <img
                            draggable={false}
                            src={playIcon}
                        />
                    </button>
                )}
            </div>
            <IconButton
                className={styles.effectButton}
                img={fasterIcon}
                title={messages.faster}
                onClick={props.onFaster}
            />
            <IconButton
                className={styles.effectButton}
                img={slowerIcon}
                title={messages.slower}
                onClick={props.onSlower}
            />
            <IconButton
                className={styles.effectButton}
                img={echoIcon}
                title={messages.echo}
                onClick={props.onEcho}
            />
            <IconButton
                className={styles.effectButton}
                img={robotIcon}
                title={messages.robot}
                onClick={props.onRobot}
            />
            <IconButton
                className={styles.effectButton}
                img={louderIcon}
                title={messages.louder}
                onClick={props.onLouder}
            />
            <IconButton
                className={styles.effectButton}
                img={softerIcon}
                title={messages.softer}
                onClick={props.onSofter}
            />
            <IconButton
                className={styles.effectButton}
                img={reverseIcon}
                title={messages.reverse}
                onClick={props.onReverse}
            />
        </div>
    </div>
);

SoundEditor.propTypes = {
    canRedo: PropTypes.bool.isRequired,
    canUndo: PropTypes.bool.isRequired,
    chunkLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
    name: PropTypes.string.isRequired,
    onActivateTrim: PropTypes.func,
    onChangeName: PropTypes.func.isRequired,
    onEcho: PropTypes.func.isRequired,
    onFaster: PropTypes.func.isRequired,
    onLouder: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onReverse: PropTypes.func.isRequired,
    onRobot: PropTypes.func.isRequired,
    onSetTrimEnd: PropTypes.func,
    onSetTrimStart: PropTypes.func,
    onSlower: PropTypes.func.isRequired,
    onSofter: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    playhead: PropTypes.number,
    trimEnd: PropTypes.number,
    trimStart: PropTypes.number
};

export default SoundEditor;
