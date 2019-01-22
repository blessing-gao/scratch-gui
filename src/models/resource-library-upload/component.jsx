import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';
import styles from './style.css';
import classNames from 'classnames';
import LibraryImage from '../resource-library-image/component.jsx';
import {connect} from 'react-redux';
import uploadBtn from '../../lib/assets/resource-library/upload-btn.png';
import soundIcon from '../../lib/assets/resource-library/sound-icon.png';
import {uploadResource, saveUserResource} from '../../lib/service/project-api';

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '.7rem',
        borderRadius: '.5rem'
    }
};

const RESBASEURL = '//cdn.imayuan.com/';


const SOUNT_TYPE = 4;

const contentFormat = [
    {
        name: '',
        md5: '',
        type: 'backdrop',
        tags: [],
        info: [480, 360, 1]
    },
    {
        name: '',
        md5: '',
        type: 'sprite',
        tags: [],
        info: [0, 4, 1],
        json: {
            objName: '',
            sounds: [],
            costumes: [],
            currentCostumeIndex: 0,
            scratchX: -20,
            scratchY: -38,
            scale: 1,
            direction: 90,
            rotationStyle: 'normal',
            isDraggable: false,
            visible: true,
            spriteInfo: {}
        }
    },
    {
        name: '',
        md5: '',
        type: 'costume',
        tags: [],
        info: [31, 100, 1]
    },
    {
        name: '',
        md5: '',
        sampleCount: 28160,
        rate: 22050,
        format: '',
        tags: []
    }
];

const SPRITE_TYPE = 2;
class LibraryUpload extends React.PureComponent {
    constructor (props){
        super(props);
        bindAll(this, [
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
        const {id, type, formData} = props;
        const typeNameList = ['背景', '封面', '造型', '声音'];
        let detail = {
            type: type,
            typeName: typeNameList[type - 1],
            content: contentFormat[type - 1]
        };
        if (id){
            const data = {...formData};
            detail = {
                id: id,
                name: data.name,
                sort: data.sort,
                ...detail
            };
            const content = JSON.parse(data.content);
            detail.cover = content.md5;
            detail.content = content;
            detail.checkedTags = content.tags;
            if (data.type === SPRITE_TYPE){
                const costumes = content.json.costumes;
                const sounds = content.json.sounds;
                if (costumes){
                    detail.modelList = costumes.map(item => ({
                        name: item.baseLayerMD5,
                        href: RESBASEURL + item.baseLayerMD5
                    }));
                }
                if (sounds){
                    detail.soundList = sounds.map(item => ({
                        name: item.md5,
                        href: RESBASEURL + item.md5
                    }));
                }
            }
        }
        this.state = {
            name: '', // 名字
            sort: '', // 排序
            type: '', // 类型
            typeName: '', // 名称
            cover: '',
            content: {},
            checkedTags: [],
            soundList: [], // 声音列表
            modelList: [], // 造型列表
            ...detail
        };
    }

    componentDidMount (){

    }

    // 更改名称
    handleChangeName (e){
        const name = e.target.value;
        const newContent = {...this.state.content};
        newContent.name = name;
        if (this.state.type === SPRITE_TYPE){
            newContent.json.objName = name;
        }
        this.setState({
            name: e.target.value,
            content: newContent
        });
    }

    // 更改排序
    handleChangeSort (e){
        if (!/^[0-9]*$/.test(e.target.value)) return false;
        this.setState({
            sort: e.target.value
        });
    }

    // 标签的选择与取消
    handleTagClick (tag){
        let tagList = [...this.state.checkedTags];
        if (tagList.includes(tag)){
            // 如果已勾选,则取消
            tagList = tagList.filter(item => item !== tag);
        } else {
            tagList.push(tag);
        }
        const newContent = {...this.state.content};
        newContent.tags = [...tagList];
        this.setState({
            checkedTags: tagList,
            content: newContent
        });
    }

    // 打开文件上传封面
    uploadOpen (type){
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
    handleUpload (e, callback){
        const reqData = {
            file: e.target.files[0]
        };
        uploadResource(reqData, result => {
            console.log(result)
            // todo 优化提示信息的显示
            const msg = {
                type: 1,
                message: result.code === 0 ? '上传成功' : '上传失败',
                status: result.code === 0 ? 1 : 2,
                timeout: 2000,
                show: true
            };
            alert(msg.message);
            if (result.code === 0){
                callback(result);
            }
        });
    }

    // 上传封面回调
    coverChange (res){
        // console.log(res);
        const newContent = {...this.state.content};
        newContent.md5 = res.msg;
        this.setState({
            cover: res.msg,
            content: newContent
        });
    }

    // 上传声音回调
    soundChange (res){
        // console.log(res);
        const soundItem = {
            name: res.msg,
            href: soundIcon
        };
        const json = {
            soundName: res.msg.split('.')[0],
            soundID: -1,
            md5: res.msg,
            sampleCount: 258,
            rate: 11025,
            format: ''
        };
        // 用于显示
        const newSoundList = [...this.state.soundList];
        newSoundList.push(soundItem);
        // 用于更新content内容
        const newContent = {...this.state.content};
        newContent.json.sounds.push(json);
        this.setState({
            soundList: newSoundList,
            content: newContent
        });
    }

    // 上传造型回调
    modelChange (res){
        const modelItem = {
            name: res.msg,
            href: RESBASEURL + res.msg
        };
        const json = {
            costumeName: res.msg.split('.')[0],
            baseLayerID: -1,
            baseLayerMD5: res.msg,
            bitmapResolution: 1,
            rotationCenterX: res.result.width ? res.result.width / 2 : 0,
            rotationCenterY: res.result.height ? res.result.height / 2 : 0
        };
        // 用于显示
        const newModelList = [...this.state.modelList];
        newModelList.push(modelItem);
        // 用于更新content内容
        const newContent = {...this.state.content};
        newContent.json.costumes.push(json);
        this.setState({
            modelList: newModelList,
            content: newContent
        });
    }

    // 删除声音
    handleDelSound (name){
        const newSoundList = this.state.soundList.filter(item => item.name !== name);
        const newContent = {...this.state.content};
        const newContentSound = newContent.json.sounds.filter(item => item.md5 != name);
        newContent.json.sounds = [...newContentSound];
        this.setState({
            soundList: newSoundList,
            content: newContent
        });
    }

    // 删除造型
    handleDelModel (name){
        const newModelList = this.state.modelList.filter(item => item.name !== name);
        const newContent = {...this.state.content};
        const newContentCostumes = newContent.json.costumes.filter(item => item.baseLayerMD5 != name);
        newContent.json.costumes = [...newContentCostumes];
        this.setState({
            modelList: newModelList,
            content: newContent
        });
    }

    // 删除封面
    handleDelCover (){
        const newContent = {...this.state.content};
        newContent.md5 = '';
        this.setState({
            cover: '',
            content: newContent
        });
    }

    handleSubmit (){
        const {name, type, content, sort, id, modelList} = this.state;
        if (!name || !content.md5){
            alert(`请先完善素材信息(名称,${this.state.typeName}为必填)`);
            return;
        }
        if (type == 2 && modelList.length == 0){
            alert('请先上传造型');
            return;
        }
        const reqData = {
            name: name,
            content: JSON.stringify(content),
            type: type,
            platformId: '1',
            sort: sort,
            id: id || ''
        };

        // todo 素材库保存逻辑
        // const url = id ? '/admin/Resource/update' : '/api/resource/saveUserResource';
        // // console.log(reqData);
        // request.default_request(id ? request.PUT : request.POST, JSON.stringify(reqData), url, result => {
        //     const msg = {
        //         type: 1,
        //         message: result.code == 0 ? '保存成功' : '保存失败',
        //         status: result.code == 0 ? 1 : 2,
        //         timeout: 2000,
        //         show: true
        //     };
        //     this.props.setConfirm(msg);
        //     if (result.code == 0) {
        //         // console.log(result);
        //         this.props.handleUploadClose();
        //         this.props.handleReload();
        //     }
        // }, null, 'application/json');
    }

    render (){
        const {type} = this.props;
        return (
            <Modal
                contentLabel="素材编辑"
                id={this.props.id}
                isOpen={this.props.visible}
                overlayClassName={styles.modalOverlay}
                style={customStyles}
                onRequestClose={this.props.onHandleUploadClose}
            >
                <div
                    className={styles.closeBtn}
                    onClick={this.props.onHandleUploadClose}
                />
                <div className={styles.modalInner}>
                    <div className={styles.modalLeft}>
                        <div className={styles.classItem}>
                            <div className={styles.classTitle}>
                                {this.state.typeName}
                                <span className={styles.isRequired}>*</span>
                            </div>
                            {
                                this.state.cover ?
                                    <div className={classNames(styles.uploadBox, styles.coverBox)}>
                                        { type == 1 ?
                                            <div
                                                className={styles.coverBg}
                                                style={{backgroundImage: `url(${RESBASEURL + this.state.cover})`}}
                                            /> :
                                            <img
                                                className={styles.coverImg}
                                                src={type === SOUNT_TYPE ? soundIcon : RESBASEURL + this.state.cover}
                                            />
                                        }
                                        <div
                                            className={styles.coverDelBtn}
                                            onClick={this.handleDelCover}
                                        />
                                    </div> :
                                    <div
                                        className={classNames(styles.uploadBox, styles.uploadCover)}
                                        onClick={this.uploadOpen('cover')}
                                    >
                                        <input
                                            accept={type === SOUNT_TYPE ? 'audio/*' : 'image/*'}
                                            className={styles.fileInput}
                                            ref={c => this.coverInput = c}
                                            type="file"
                                            onChange={e => this.handleUpload(e, this.coverChange)}
                                        />
                                    </div>
                            }
                        </div>
                        { type == 2 &&
                        <div>
                            <div className={styles.classItem}>
                                <div className={styles.classTitle}>声音</div>
                                <div
                                    className={classNames(styles.uploadBox, styles.uploadSound)}
                                    onClick={this.uploadOpen('sound')}
                                >
                                    <input
                                        accept={'audio/*'}
                                        className={styles.fileInput}
                                        ref={c => this.soundInput = c}
                                        type="file"
                                        onChange={e => this.handleUpload(e, this.soundChange)}
                                    />
                                </div>
                            </div>
                            <LibraryImage
                                className={styles.imgList}
                                imageList={this.state.soundList}
                                onHandleDel={this.handleDelSound}
                            />
                            <div className={styles.classItem}>
                                <div className={styles.classTitle}>造型</div>
                                <div
                                    className={classNames(styles.uploadBox, styles.uploadModel)}
                                    onClick={this.uploadOpen('model')}
                                >
                                    <input
                                        accept={'image/*'}
                                        className={styles.fileInput}
                                        ref={c => this.modelInput = c}
                                        type="file"
                                        onChange={e => this.handleUpload(e, this.modelChange)}
                                    />
                                </div>
                            </div>
                            <LibraryImage
                                className={styles.imgList}
                                imageList={this.state.modelList}
                                onHandleDel={this.handleDelModel}
                            />
                        </div>
                        }
                    </div>
                    <div className={styles.modalDivider} />
                    <div className={styles.modalRight}>
                        <div className={styles.classItem}>
                            <div className={styles.classTitle}>名称<span className={styles.isRequired}>*</span></div>
                            <input
                                className={styles.input}
                                placeholder="请输入素材名称"
                                value={this.state.name}
                                onChange={this.handleChangeName}
                            />
                        </div>
                        <div className={styles.classItem}>
                            <div className={styles.classTitle}>排序</div>
                            <input
                                className={styles.input}
                                placeholder="请输入排序"
                                value={this.state.sort}
                                onChange={this.handleChangeSort}
                            />
                        </div>
                        <div className={styles.classItem}>
                            <div className={styles.classTitle}>标签</div>
                            <div className={styles.classBox}>
                                {(this.props.tags || []).map((tagProps, id) => (
                                    <span
                                        className={classNames(
                                            styles.classBtn,
                                            this.state.checkedTags.includes(tagProps.title) ? styles.activeBtn : ''
                                        )}
                                        key={tagProps.id}
                                        onClick={this.handleTagClick(tagProps.title)}
                                    >
                                        {tagProps.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.uploadBtn}>
                            <img
                                src={uploadBtn}
                                onClick={this.handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

LibraryUpload.propTypes = {
    formData: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.number,
    visible: PropTypes.bool,
    onHandleReload: PropTypes.func,
    onHandleUploadClose: PropTypes.func
};

const mapDispatchToProps = dispatch => ({

});


export default connect(
    null,
    mapDispatchToProps
)(LibraryUpload);
