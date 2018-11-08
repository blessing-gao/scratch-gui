import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import request from '../../lib/request';
import Modal from 'react-modal';
import styles from './library-upload.css';
import classNames from 'classnames';
import uploadBtn from '../../lib/assets/upload-btn.png';

const customStyles = {
    content : {
        top                   : '40%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        padding               : '.7rem',
        borderRadius          : '.5rem'
    }
};

class LibraryUpload extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this,[
            'handleTagClick',
            'uploadCover'
        ]);
        this.state = {
            checkedTags: []
        }
    }

    componentDidMount(){

    }

    // 标签的选择与取消
    handleTagClick(tag){
        let tagList = [...this.state.checkedTags];
        if(tagList.includes(tag)){
            // 如果已勾选,则取消
            tagList = tagList.filter(item => item !== tag);
        }else {
            tagList.push(tag);
        }
        this.setState({
            checkedTags: tagList
        })
    }

    // 打开文件上传封面
    uploadCover(){
        this.coverInput.click();
    }

    // 上传封面
    coverChange(){
        
    }

    render (){
        return (
            <Modal
                id={this.props.id}
                isOpen={this.props.visible}
                onRequestClose={this.props.handleUploadClose}
                contentLabel="Example Modal"
                style={customStyles}
                overlayClassName={styles.modalOverlay}
            >
              <div className={styles.closeBtn} onClick={this.props.handleUploadClose}></div>
              <div className={styles.modalInner}>
                  <div className={styles.modalLeft}>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>封面</div>
                          <div className={classNames(styles.uploadBox,styles.uploadCover)}
                               onClick={this.uploadCover}
                          >
                              <input
                                  accept={'.svg, .png, .jpg, .jpeg'}
                                  className={styles.fileInput}
                                  ref={(c) => this.coverInput = c}
                                  type="file"
                                  onChange={this.coverChange}
                              />
                          </div>
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>声音</div>
                          <div className={classNames(styles.uploadBox,styles.uploadSound)}></div>
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>造型</div>
                          <div className={classNames(styles.uploadBox,styles.uploadModel)}></div>
                      </div>
                  </div>
                  <div className={styles.modalDivider}></div>
                  <div className={styles.modalRight}>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>名称</div>
                          <input
                              placeholder="请输入素材名称"
                              className={styles.input}
                          />
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>排序</div>
                          <input
                              placeholder="请输入排序"
                              className={styles.input}
                          />
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>标签</div>
                          <div className={styles.classBox}>
                              {(this.props.tags || []).map((tagProps,id) => (
                                  <span
                                      className={classNames(
                                                styles.classBtn,
                                                this.state.checkedTags.includes(tagProps.title) ? styles.activeBtn : ''
                                            )}
                                      onClick={this.handleTagClick.bind(this,tagProps.title)}
                                      key={tagProps.id}
                                  >
                                            {tagProps.title}
                                        </span>
                              ))}
                          </div>
                      </div>
                      <div className={styles.uploadBtn}>
                          <img src={uploadBtn}/>
                      </div>
                  </div>
              </div>
            </Modal>
        );
    }
}

LibraryUpload.propTypes = {
    visible: PropTypes.bool,
    handleUploadClose: PropTypes.func,
};

export default LibraryUpload;
