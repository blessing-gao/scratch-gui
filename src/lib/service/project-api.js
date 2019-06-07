import xhr from 'xhr';
import {API_HOST} from '../../config';

const getCurrentUser = id => new Promise((resolve, reject) => {
    xhr({
        method: 'GET',
        uri: `${API_HOST}/api/user/getInfo?id=${id}`
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body).data1);
    });
});

// 获取作品详情
const getProjectInfo = id => new Promise((resolve, reject) => {
    xhr({
        method: 'GET',
        uri: `${API_HOST}/api/project/getInfo?id=${id}`
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body).data);
    });
});

// 保存作品
const saveProject = data => new Promise((resolve, reject) => {
    const formData = new FormData();
    if (typeof data === 'object') {
        for (const k in data) {
            formData.append(k, data[k]);
        }
    }
    xhr({
        method: 'POST',
        uri: `${API_HOST}/api/project/saveScratch`,
        body: formData
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            return reject(error);
        }
        return resolve(JSON.parse(response.body));
    });
});

export {
    getCurrentUser,
    getProjectInfo,
    saveProject
};
