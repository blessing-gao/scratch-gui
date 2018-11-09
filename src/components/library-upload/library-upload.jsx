import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import request from '../../lib/request';
import Modal from 'react-modal';
import styles from './library-upload.css';
import classNames from 'classnames';
import LibraryImage from '../library-image/library-image.jsx';
import {connect} from 'react-redux';
import {setConfirm,setConfirmBack} from '../../reducers/confirm';
import uploadBtn from '../../lib/assets/upload-btn.png';
import soundIcon from '../../lib/assets/sound-icon.png';

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

const RESBASEURL = "//cdn.imayuan.com/";

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
            'handleUpload',
            'handleDelSound',
            'handleDelModel',
            'handleDelCover',
            'handleChangeName',
            'handleChangeSort',
            'handleSubmit'
        ]);
        this.state = {
            name: '',   // 名字
            sort: '',   // 排序
            type: '',   // 类型
            typeName: '',   // 名称
            cover: '',
            content: {},
            checkedTags: [],
            soundList: [],  // 声音列表
            modelList: [],  // 造型列表
        }
    }

    componentDidMount(){
        let typeNameList = ['背景','封面','造型','声音'];
        this.setState({
            type: this.props.type,
            typeName: typeNameList[this.props.type-1],
            content: contentFormat[this.props.type-1]
        });
    }

    // 更改名称
    handleChangeName(e){
        let name = e.target.value;
        let newContent = {...this.state.content};
        newContent.name = name;
        if(this.state.type == 2){
            newContent.json.objName = name;
        }
        this.setState({
            name: e.target.value,
            content: newContent
        })
    }

    // 更改排序
    handleChangeSort(e){
        if(!/^[0-9]*$/.test(e.target.value)) return false;
        this.setState({
            sort: e.target.value
        })
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
        let newContent = {...this.state.content};
        newContent.tags = [...tagList];
        this.setState({
            checkedTags: tagList,
            content: newContent
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
            // todo 优化提示信息的显示
            let msg = {
                type: 1,
                message: result.code == 0 ? '上传成功' : '上传失败',
                status: result.code == 0 ? 1 : 2,
                timeout: 2000,
                show: true
            };
            this.props.setConfirm(msg);
            if(result.code == 0){
                callback(result);
            }
        });
    }

    // 上传封面回调
    coverChange(res){
        // console.log(res);
        let newContent = {...this.state.content};
        newContent.md5 = res.msg;
        this.setState({
            cover: res.msg,
            content: newContent
        })
    }

    // 上传声音回调
    soundChange(res){
        // console.log(res);
        let soundItem = {
            name: res.msg,
            href: soundIcon
        };
        let json = {
            soundName: res.msg.split(".")[0],
            soundID: -1,
            md5: res.msg,
            sampleCount: 258,
            rate: 11025,
            format: ""
        };
        // 用于显示
        let newSoundList = [...this.state.soundList];
        newSoundList.push(soundItem);
        // 用于更新content内容
        let newContent = {...this.state.content};
        newContent.json.sounds.push(json);
        this.setState({
            soundList: newSoundList,
            content: newContent
        })
    }

    // 上传造型回调
    modelChange(res){
        let modelItem = {
            name: res.msg,
            href: RESBASEURL + res.msg
        };
        let json = {
            costumeName: res.msg.split(".")[0],
            baseLayerID: -1,
            baseLayerMD5: res.msg,
            bitmapResolution: 1,
            rotationCenterX: res.result.width/2,
            rotationCenterY: res.result.height/2
        };
        // 用于显示
        let newModelList = [...this.state.modelList];
        newModelList.push(modelItem);
        // 用于更新content内容
        let newContent = {...this.state.content};
        newContent.json.costumes.push(json);
        this.setState({
            modelList: newModelList,
            content: newContent
        })
    }

    // 删除声音
    handleDelSound(name){
        let newSoundList = this.state.soundList.filter(item => item.name !== name);
        let newContent = {...this.state.content};
        let newContentSound = newContent.json.sounds.filter(item => item.md5 != name);
        newContent.json.sounds = [...newContentSound];
        this.setState({
            soundList: newSoundList,
            content: newContent
        })
    }

    // 删除造型
    handleDelModel(name){
        let newModelList = this.state.modelList.filter(item => item.name !== name);
        let newContent = {...this.state.content};
        let newContentCostumes = newContent.json.costumes.filter(item => item.baseLayerMD5 != name);
        newContent.json.costumes = [...newContentCostumes];
        this.setState({
            modelList: newModelList,
            content: newContent
        })
    }

    // 删除封面
    handleDelCover(){
        let newContent = {...this.state.content};
        newContent.md5 = '';
        this.setState({
            cover: '',
            content: newContent
        })
    }

    handleSubmit(){
        let { name, type, content, sort} = this.state;
        let reqData = {
            name: name,
            content: JSON.stringify(content),
            type: type,
            platformId: "1",
            sort: sort
        };
        // console.log(reqData);
        request.default_request(request.POST, JSON.stringify(reqData), `api/resource/saveUserResource`, result => {
            if (result.code == 0) {
                // console.log(result);
            }
        }, 'http://192.168.0.102:8081/', 'application/json');
    }

    render (){
        const { type } = this.props;
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
                          <div className={styles.classTitle}>{this.state.typeName}</div>
                          {
                              this.state.cover ?
                                  <div className={classNames(styles.uploadBox,styles.coverBox)}>
                                      { type == 1 ?
                                          <div
                                              className={styles.coverBg}
                                              style={{ backgroundImage: `url(${RESBASEURL + this.state.cover})`}}
                                          ></div> :
                                          <img
                                              src={ type == 4 ? soundIcon : RESBASEURL + this.state.cover}
                                              className={styles.coverImg}
                                          />
                                      }
                                      <div className={styles.coverDelBtn} onClick={this.handleDelCover}></div>
                                  </div> :
                                  <div className={classNames(styles.uploadBox,styles.uploadCover)}
                                       onClick={this.uploadOpen.bind(this,'cover')}
                                  >
                                      <input
                                          accept={ type == 4 ? 'audio/*' : 'image/*'}
                                          className={styles.fileInput}
                                          ref={(c) => this.coverInput = c}
                                          type="file"
                                          onChange={(e)=>this.handleUpload(e, this.coverChange)}
                                      />
                                  </div>
                          }
                      </div>
                      { type == 2 &&
                      <div>
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
                          <LibraryImage
                              className={styles.imgList}
                              imageList={this.state.soundList}
                              handleDel={this.handleDelSound}
                          />
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
                          <LibraryImage
                              className={styles.imgList}
                              imageList={this.state.modelList}
                              handleDel={this.handleDelModel}
                          />
                      </div>
                      }
                  </div>
                  <div className={styles.modalDivider}></div>
                  <div className={styles.modalRight}>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>名称</div>
                          <input
                              placeholder="请输入素材名称"
                              className={styles.input}
                              value={this.state.name}
                              onChange={this.handleChangeName}
                          />
                      </div>
                      <div className={styles.classItem}>
                          <div className={styles.classTitle}>排序</div>
                          <input
                              placeholder="请输入排序"
                              className={styles.input}
                              value={this.state.sort}
                              onChange={this.handleChangeSort}
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
                          <img src={uploadBtn} onClick={this.handleSubmit}/>
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

const mapDispatchToProps = dispatch => ({
    setConfirm:(confirm) => {dispatch(setConfirm(confirm));}
});


export default connect(
    null,
    mapDispatchToProps
)(LibraryUpload);
