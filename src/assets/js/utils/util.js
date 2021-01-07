import echo from '../libs/echo.js';
function lazyImg(){
    echo.init({
        offsetBottom : 100,//可视区域多少像素可以被加载(相当于往下面提前加载100个像素)
        throttle : 0 //设置图片延迟加载的时间
    });
}

function localParam(search, hash) {
    search = search || window.location.search;  //search: ?keyWords=[object%20Object]
    hash = hash || window.location.hash;  // ""
    var fn = function(str, reg) {
        if (str) {
            var data = {};
            str.replace(reg, function($0, $1, $2, $3) {
                data[$1] = $3;
            });
            // console.log('util-data', data)
            return data;
        }
    }
    return {
        search : fn(search, new RegExp("([^?=&]+)(=([^&]*))?", "g")) || {},
        hash : fn(hash, new RegExp("([^#=&]+)(=([^&]*))?", "g")) || {}
    };
}

export {
    lazyImg,
    localParam
}