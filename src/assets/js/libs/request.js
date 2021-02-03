/*eslint-disable*/
import axios from 'axios';

// 原始的fetch方式
function request(pUrl, pType = 'get', data = {}) {
    let config = {}, params = [], headers = null;

    if (pType === 'get') {
        config = {
            method: pType
        }
    } else if (pType === 'post') {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        for (let key in data) {
            params.push(key + '=' + data[key])
        }
        config = {
            method: pType,
            headers,
            body: params.join('&')
        }
    } else {
        pType = 'post';
        if (data instanceof Object) {
            params = new FormData();
            for (let key in data) {
                params.append(key, data[key]);
            }
        }
        config = {
            method: pType,
            body: params
        }
    }
    return fetch(pUrl, config).then((res) => {
        // console.log('request-pUrl-config', pUrl, config)
        return res.json();
    })
}

// 潮流的axios方式
// function request(pUrl, pType = 'get', data = {}) {
//     let config = {}, params = [], headers = null;

//     if (pType === 'get') {
//         config = {
//             method: pType
//         }
//     } else if (pType === 'post') {
//         headers = {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//         for (let key in data) {
//             params.push(key + '=' + data[key])
//         }
//         config = {
//             method: pType,
//             headers,
//             body: params.join('&')
//         }
//     } else {
//         pType = 'post';
//         if (data instanceof Object) {
//             params = new FormData();
//             for (let key in data) {
//                 params.append(key, data[key]);
//             }
//         }
//         config = {
//             method: pType,
//             body: params
//         }
//     }

//     return axios(pUrl, config).then((res) => {
//         return res.data
//     }).catch((e) => {
//         console.log('网络错误', e)
//     })
// }

export {
    request
};