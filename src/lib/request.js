/* eslint-disable func-style,require-jsdoc */

/**
 * Created by 26928 on 2017-10-17.
 */
export const ASSET_SERVER = 'http://owkomi1zd.bkt.clouddn.com/';
export const COVER_SERVER = 'http://cdn.imayuan.com/cover/';
export function getHost () {
    // console.log(`${window.location.protocol}//${window.location.host}`);
    // return 'http://localhost:8080';
    return `${window.location.protocol}//${window.location.host}`;
}
export function getQueryString (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
}

export default {
    POST: 'POST',
    GET: 'GET',
    SUCCERR: '10000',
    UserError: '10001',
    NotFindError: '10002',
    default_request: function (func, data, path, callback, asyn = true) {
        try {
            const HOST = getHost();
            if (func == this.POST){
                if (typeof data === 'object'){
                    const arrs = [];
                    for (const k in data){
                        arrs.push(`${k}=${data[k]}`);
                    }
                    data = arrs.join('&');
                }
            }

            const obj = new XMLHttpRequest();
            obj.open(func, HOST + path, asyn);
            obj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;'); // 添加http头，发送信息至服务器时内容编码类型
            obj.send(data);
            obj.onreadystatechange = function () {
                if (obj.readyState == XMLHttpRequest.DONE){
                    if (obj.status === 200){
                        const res = JSON.parse(obj.responseText);
                        if (asyn){
                            callback(res);
                        } else {
                            return res;
                        }
                    } else {
                        callback({error: obj.status});
                        return {error: obj.status};
                    }
                }
                // else {
                //     callback({errno: false});
                // }

            };
        } catch (e){
            console.log(e);
            alert('网络错误，请稍后尝试');
        }

    },
    out_request: function (func, data, path, callback, asyn = true) {
        try {
            if (func == this.POST){
                if (typeof data === 'object'){
                    const arrs = [];
                    for (const k in data){
                        arrs.push(`${k}=${data[k]}`);
                    }
                    data = arrs.join('&');
                }
            }
            const obj = new XMLHttpRequest();
            obj.open(func, path, asyn);
            obj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;'); // 添加http头，发送信息至服务器时内容编码类型
            obj.send(data);
            obj.onreadystatechange = function () {
                if (obj.readyState == XMLHttpRequest.DONE){
                    if (obj.status == 200){
                        const res = JSON.parse(obj.responseText);
                        if (asyn){
                            callback(res);
                        } else {
                            return res;
                        }
                    } else {
                        callback({error: obj.status});
                        return {error: obj.status};
                    }
                }
                // else {
                //     callback({errno: false});
                // }

            };
        } catch (e){
            console.log(e);
            alert('网络错误，请稍后尝试');
        }

    }
};
