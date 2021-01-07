// 网易云课堂后端
let prodUrl = "http://vueshop.glbuys.com";
let devUrl = "http://vueshop.glbuys.com";

// mock模拟的后端
// let prodUrl = "http://localhost:3000";
// let devUrl = "http://localhost:3000";
let baseUrl = process.env.NODE_ENV === 'development' ? devUrl : prodUrl;
export default {
    baseUrl: baseUrl,
    path: "/",
    token: "1ec949a15fb709370f"
}