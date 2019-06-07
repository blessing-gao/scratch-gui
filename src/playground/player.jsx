import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {compose} from 'redux';

import Box from '../components/box/box.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import TitledHOC from '../lib/titled-hoc.jsx';
import styles from './player.css';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

const WrappedGui = AppStateHOC(HashParserHOC(GUI));

const Player = () => (
    <Box
        className={classNames(styles.stageOnly)}
    >
        <WrappedGui
            isFullScreen
            isPlayerOnly
        />
    </Box>
);

Player.propTypes = {
};

const ConnectedPlayer = connect()(Player);

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedPlayer = compose(
    AppStateHOC,
    HashParserHOC,
    TitledHOC
)(ConnectedPlayer);

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);

ReactDOM.render(<WrappedPlayer isPlayerOnly />, appTarget);
