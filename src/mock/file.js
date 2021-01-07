// import { Random } from 'mockjs'
// import config from '../assets/js/conf/config'

// export default [
//     // 快速导航接口
//     {
//         url: config.baseUrl + '/api/home/index/nav?token=' + config.token,
//         type: 'get',
//         respone: () => {
//             let data = [];
//             let navTitle = ['潮流前线', '品牌男装', '可爱童装', '大码女装']
//             for (let i = 0; i < 4; i++) {
//                 let dataObj = {
//                     'cid': i,
//                     'title': navTitle[i],
//                     'image': Random.dataImage()
//                 }
//                 data.push(dataObj)
//             }
//             return {
//                 code: 200,
//                 data: data
//             }
//         }
//     },

//     // 轮播图接口
//     {
//         url: config.baseUrl + "/api/home/index/slide?token=" + config.token,
//         type: 'get',
//         respone: () => {
//             let data = [];
//             let swiperTitle = ['轮播图1', '轮播图2', '轮播图2', '轮播图4']
//             let swiperImg = [require('../assets/images/home/swiper/111.jpg'), require('../assets/images/home/swiper/222.jpg'), require('../assets/images/home/swiper/333.jpg'), require('../assets/images/home/swiper/444.jpg')]
//             for (let i = 0; i < 4; i++) {
//                 let dataObj = {
//                     'cid': i,
//                     'title': swiperTitle[i],
//                     // 'image': Random.image('400x200', swiperImg[i])
//                     'image': Random.dataImage()
//                 }
//                 data.push(dataObj)
//             }
//             return {
//                 code: 200,
//                 data: data
//             }
//         }

//     }
// ]
