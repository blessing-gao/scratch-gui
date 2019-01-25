import xhr from 'xhr';
import {getHost} from '../config';

// 获取作品详情
const getProjectInfo = id => new Promise((resolve, reject) => {
    xhr({
        method: 'GET',
        uri: `${getHost()}/api/project/3.0/${id}/getInfo`
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body));
    });
});

// 获取用户个人的作品
const getUserProjects = data => new Promise((resolve, reject) => {
    xhr({
        method: 'POST',
        uri: `${getHost()}/api/project/3.0/getUserProjects`,
        json: data
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(response.body);
    });
});

// 获取作品库标签
const getProjectTags = type => new Promise((resolve, reject) => {
    xhr({
        method: 'GET',
        uri: `${getHost()}/api/project/3.0/tags?type=${type}`
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body));
    });
});

// 保存作品
const saveProject = data => new Promise((resolve, reject) => {
    const formData = new FormData();
    if (typeof data === 'object'){
        for (const k in data){
            formData.append(k, data[k]);
        }
    }
    xhr({
        method: 'POST',
        uri: `${getHost()}/api/project/3.0/saveWork`,
        body: formData
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body));
    });
});

// 删除作品
const deleteProject = id => new Promise((resolve, reject) => {
    xhr({
        method: 'POST',
        uri: `${getHost()}/api/project/3.0/${id}/delete`
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body));
    });
});

// 上传素材
const uploadResource = data => new Promise((resolve, reject) => {
    const formData = new FormData();
    if (typeof data === 'object'){
        for (const k in data){
            formData.append(k, data[k]);
        }
    }
    xhr({
        method: 'POST',
        uri: `${getHost()}/api/aliyun/fileUpload`,
        body: formData
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(response.body);
    });
});

const saveUserResource = data => new Promise((resolve, reject) => {
    xhr({
        method: 'POST',
        uri: `${getHost()}/api/resource/saveUserResource`,
        json: data
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(response.body);
    });
});

export {
    getProjectInfo,
    getUserProjects,
    getProjectTags,
    saveProject,
    deleteProject,
    uploadResource,
    saveUserResource
};
