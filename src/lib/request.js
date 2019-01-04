/* eslint-disable func-style,require-jsdoc */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import Cookies from 'universal-cookie';
/**
 * Created by 26928 on 2017-10-17.
 */
const cookies = new Cookies();
export const ASSET_SERVER = '//owkomi1zd.bkt.clouddn.com/';
export const COVER_SERVER = '//cdn.imayuan.com/cover/';
export function getHost () {
    // console.log(`${window.location.protocol}//${window.location.host}`);
    return '//scratch.imayuan.com:8088';
    // return `${window.location.protocol}//${window.location.host}`;
    // return 'http://192.168.1.100:8081';
}
export function getQueryString (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
}
export function getTargetId(url = window.location.href) {
    if(url.indexOf("#") < 0) return null;
    const arr = url.split(/\#|\?/);
    if(arr.length > 1) return arr[1];
    return null;
}
// base64加密开始
var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
    + "wxyz0123456789+/" + "=";

export function encode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
            + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
};


export default {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    SUCCERR: '10000',
    UserError: '10001',
    NotFindError: '10002',
    default_request: function (func, data, path, callback, host, header, asyn = true) {
        try {
            const HOST = host ? host : getHost();
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
            obj.setRequestHeader('token', cookies.get('token'));
            obj.setRequestHeader('platForm', cookies.get('platFormId') || "mayuan");
            obj.setRequestHeader('Content-type', header ? header : 'application/x-www-form-urlencoded;'); // 添加http头，发送信息至服务器时内容编码类型
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

    },
    file_request: function (func, data, path, callback, asyn = true) {
        try {
            const HOST = getHost();
            // const HOST = "http://192.168.1.100:8081";
            if (func == this.POST){
                var formData = new FormData();
                if (typeof data === 'object'){
                    for (const k in data){
                        formData.append(k,data[k]);
                    }
                }
            }
            const obj = new XMLHttpRequest();
            obj.open(func, HOST + path, asyn);
            obj.setRequestHeader('token', cookies.get('token'));
            obj.setRequestHeader('platForm', cookies.get('platFormId') || "mayuan");
            obj.send(formData);
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
    },
    promise_request: function (url, data, method = 'GET', options = {}) {
        return new Promise(function (resolve, reject) {
            if (typeof data === 'object'){
                const arrs = [];
                for (const k in data){
                    arrs.push(`${k}=${data[k]}`);
                }
                data = arrs.join('&');
            }
            let params = {
                method: method
            };
            if (method === 'GET') { // 如果是GET请求，拼接url
                url += '?' + data;
            } else {
                params.body = data;
            }
            if(options.cookie!=undefined){
                params.credentials='include'
            }
            if(options.headers!=undefined && typeof options.headers=="object"){
                params.headers=new Headers(options.headers);
            }else{
                params.headers=new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
            }
            fetch(url, params).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    resolve(res);
                }else {
                    reject(res);
                }
            });
        })
    }
};
