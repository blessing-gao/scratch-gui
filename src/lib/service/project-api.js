import xhr from 'xhr';
import {getHost} from '../config';


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

export {
    getProjectInfo
};
