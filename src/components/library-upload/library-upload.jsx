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

let contentFormat = [
    {
        name: "",
        md5: "",
        type: "backdrop",
        tags: [],
        info: [480, 360, 1]
    },
    {
        name: "",
        md5: "",
        type: "sprite",
        tags: [],
        info: [0, 4, 1],
        json: {
            objName: "",
            sounds: [],
            costumes: [],
            currentCostumeIndex: 0,
            scratchX: -20,
            scratchY: -38,
            scale: 1,
            direction: 90,
            rotationStyle: "normal",
            isDraggable: false,
            visible: true,
            spriteInfo: {}
        }
    },
    {
        name: "",
        md5: "",
        type: "costume",
        tags: [],
        info: [31, 100, 1]
    },
    {
        name: "",
        md5: "",
        sampleCount: 28160,
        rate: 22050,
        format: "",
        tags: []
    }
];

class LibraryUpload extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this,[
            'handleTagClick',
            'uploadOpen',
            'coverChange',
            'soundChange',
            'modelChange',
            'handleUpload'
        ]);
        this.state = {
            content: {},
            checkedTags: []
        }
    }

    componentDidMount(){
        this.setState({
            content: contentFormat[this.props.type-1]
        });
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
    uploadOpen(type){
        switch (type){
            case 'cover':
                this.coverInput.click();
                break;
            case 'sound':
                this.soundInput.click();
                break;
            case 'model':
                this.modelInput.click();
                break;
        }
    }

    // 上传文件
    handleUpload(e, callback){
        let reqData = {
            file: e.target.files[0]
        };
        request.file_request(request.POST, reqData, '/api/aliyun/fileUpload', result => {
            callback(result);
        });
    }

    // 上传封面回调
    coverChange(res){
        console.log(res);
    }

    // 上传声音回调
    soundChange(res){
        console.log(res);
    }

    // 上传造型回调
    modelChange(res){
        console.log(res);
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
                               onClick={this.uploadOpen.bind(this,'cover')}
                          >
                              <input
                                  accept={'image/*'}
                                  className={styles.fileInput}
                                  ref={(c) => this.coverInput = c}
                                  type="file"
                                  onChange={(e)=>this.handleUpload(e, this.coverChange)}
                              />
                          </div>
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>声音</div>
                          <div className={classNames(styles.uploadBox,styles.uploadSound)}
                               onClick={this.uploadOpen.bind(this,'sound')}
                          >
                              <input
                                  accept={'audio/*'}
                                  className={styles.fileInput}
                                  ref={(c) => this.soundInput = c}
                                  type="file"
                                  onChange={(e)=>this.handleUpload(e, this.soundChange)}
                              />
                          </div>
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>造型</div>
                          <div className={classNames(styles.uploadBox,styles.uploadModel)}
                               onClick={this.uploadOpen.bind(this,'model')}
                          >
                              <input
                                  accept={'image/*'}
                                  className={styles.fileInput}
                                  ref={(c) => this.modelInput = c}
                                  type="file"
                                  onChange={(e)=>this.handleUpload(e, this.modelChange)}
                              />
                          </div>
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
