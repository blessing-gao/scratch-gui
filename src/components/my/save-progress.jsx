import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './save-progress.css';
import classNames from 'classnames';
import loadingIcon from '../../lib/assets/progress-load.png';
import successIcon from '../../lib/assets/progress-success.png';

const SaveProgressComponent = props => {
    const {
        loadStatus
    } = props;

    const progress = ['预处理','提交中','解析中'];

    return (
        <Box className={styles.progressBox}>
            <div className={styles.progressInner}>
                <div className={styles.progressMain}>
                    <div className={styles.progressBg}
                         style={{ width: loadStatus == progress.length-1 ? '100%' : (loadStatus + 1) * 30 +'%'}}
                    ></div>
                    <div className={styles.progressContainer}>
                        {
                            progress.map((item,index) => {
                                let content = [
                                    <span className={
                                        classNames(styles.progressItem,
                                          {[styles.done]:  index < loadStatus},
                                          {[styles.active]: index === loadStatus}
                                        )
                                    }
                                    key={'progress-'+index}>{item}</span>
                                ];
                                if(index < progress.length - 1){
                                    content.push(
                                        <span
                                            key={'divider-'+index}
                                            className={
                                                classNames(styles.progressDivider,
                                                    {[styles.doneBg]:  index < loadStatus}
                                                )}
                                        ></span>
                                    )
                                }
                                return content;
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.progressStatus}>
                {loadStatus < progress.length - 1 ?
                    <img className={classNames(styles.progressImg,styles.loading)} src={loadingIcon}/>:
                    <img className={styles.progressImg} src={successIcon}/>
                }
            </div>
        </Box>
    );

};

SaveProgressComponent.propTypes = {
    loadStatus: PropTypes.number.isRequired
};
SaveProgressComponent.defaultProps = {
    loadStatus: 0
};

export default SaveProgressComponent;
