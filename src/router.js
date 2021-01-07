/*
 HashRouter:有#号 
 BrowserRouter:没有#号 
 Switch:只要匹配到一个地址不往下匹配，相当于for循环里面的break 
 Link:跳转页面，相当于vue里面的router-link
exact :完全匹配路由 
* */
import React from 'react';
import  {HashRouter as Router,Route,Switch,Redirect}  from  'react-router-dom';
//import {PrivateRoute} from './routes/private';
import asyncComponents from './components/async/AsyncComponent';
import config from './assets/js/conf/config.js';
const HomeComponent=asyncComponents(()=>import('./pages/home/home/index'));
const GoodsClassify=asyncComponents(()=>import('./pages/home/goods/classify'));
const GoodsSearch=asyncComponents(()=>import('./pages/home/goods/search'));
const GoodsDetails=asyncComponents(()=>import('./pages/home/goods/details'));
const LoginIndex=asyncComponents(()=>import('./pages/home/login/index'));
const RegIndex=asyncComponents(()=>import('./pages/home/reg/index'));
const OrderIndex=asyncComponents(()=>import('./pages/home/order/index'));
const OrderEnd=asyncComponents(()=>import('./pages/home/order/end'));
const AddressIndex=asyncComponents(()=>import('./pages/home/address/index'));
const AddressAdd=asyncComponents(()=>import('./pages/home/address/add'));
const AddressEdit=asyncComponents(()=>import('./pages/home/address/edit'));
const MyOrder=asyncComponents(()=>import('./pages/user/myorder/index'));
const OrderDetail=asyncComponents(()=>import('./pages/user/myorder/detail'));
const UserinfoIndex=asyncComponents(()=>import('./pages/user/userinfo/index'));
const UserAddreIndex=asyncComponents(()=>import('./pages/user/address/index'));
const ChangePswIndex=asyncComponents(()=>import('./pages/user/changepsw/index'));
const MarkIndex=asyncComponents(()=>import('./pages/user/mark/index'));
export default class RouterComponent extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Router>
                    <React.Fragment>
                        <Switch>
                            <Route path={config.path+"home"} component={HomeComponent} ></Route>
                            <Route path={config.path+"goods/classify"} component={GoodsClassify} ></Route>
                            <Route path={config.path+"goods/search"} component={GoodsSearch} ></Route>
                            <Route path={config.path+"goods/details"} component={GoodsDetails} ></Route>
                            <Route path={config.path+"login/index"} component={LoginIndex} ></Route>
                            <Route path={config.path+"reg/index"} component={RegIndex} ></Route>
                            <Route path={config.path+"order/index"} component={OrderIndex} ></Route>
                            <Route path={config.path+"order/end"} component={OrderEnd} ></Route>
                            <Route path={config.path+"address/index"} component={AddressIndex} ></Route>
                            <Route path={config.path+"address/add"} component={AddressAdd} ></Route>
                            <Route path={config.path+"address/edit"} component={AddressEdit} ></Route>
                            <Route path={config.path+"myorder/order"} component={MyOrder} ></Route>
                            <Route path={config.path+"myorder/detail"} component={OrderDetail} ></Route>
                            <Route path={config.path+"user/userinfo"} component={UserinfoIndex} ></Route>
                            <Route path={config.path+"user/address"} component={UserAddreIndex} ></Route>
                            <Route path={config.path+"user/changepsw"} component={ChangePswIndex} ></Route>
                            <Route path={config.path+"user/mark"} component={MarkIndex} ></Route>
                            <Redirect to={config.path+"home/index"}></Redirect>
                        </Switch>
                    </React.Fragment>
                </Router>
            </React.Fragment>
        )
    }
}
