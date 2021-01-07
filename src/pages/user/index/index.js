/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import actions from '../../../actions';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/index/index.css';
class  userIndex extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            nickname: '',
            points: 0,
            head: ''
        }
    }
    componentDidMount(){
        this.getUserInfo()
    }

    // 获得用户信息
    getUserInfo() {
        if (this.props.state.user.isLogin === true){
            let sUrl = config.baseUrl + "/api/user/myinfo/userinfo/uid/" + this.state.uid + "?token=" + config.token;
            request(sUrl).then((res) => {
                console.log('user-getRecord-res', res);
                if( res.code === 200) {
                    this.setState({ 
                        uid: res.data.uid, 
                        nickname: res.data.nickname,
                        points: res.data.points,
                        head: res.data.head
                    })
                }
            })
        }
        let params = {uid: this.state.uid}
        
    }

    // 点击退出登录
    outLogin() {
        let sUrl = config.baseUrl + '/api/home/user/safeout?token=1ec949a15fb709370f';
        request(sUrl, 'post', {uid: this.props.state.user.nickname}).then((res) => {
            console.log('outLogin',res);
            if(res.code === 200) {
                // localStorage.removeItem['uid'];
                this.props.dispatch(actions.user.outLogin());
                this.props.history.goBack()
            }
        })
    }

    // 路由页面跳转
    pushPage(url) {
        this.props.history.push(config.path + url)
    }

    render(){
        return(
            <div className={['page']}>
                <HeadComponent title='会员中心'></HeadComponent>
                <div className={Css['top-wrap']}>
                    <div className={Css['icon-name-wrap']}>
                        <div className={Css['icon']}><img src={this.state.head}></img></div>
                        <div className={Css['name']}>
                            <div>{this.state.nickname}</div>
                            <div>我的积分：{this.state.points}</div>
                        </div>
                    </div>
                </div>
                <div className={Css['order-wrap']}>
                    <div>全部订单</div>
                    <div onClick={this.pushPage.bind(this, 'myorder/order?status=all')}>查看全部订单 &gt;</div>
                </div>
                <div className={Css['item-wrap']}>
                    <div className={Css['item']}>
                        <div className={Css['icon'] + ' ' + Css['pay']}></div>
                        <div className={Css['title']}>待支付</div>
                    </div>
                    <div className={Css['item']}>
                        <div className={Css['icon'] + ' ' + Css['getGoods']}></div>
                        <div className={Css['title']}>待收货</div>
                    </div>
                    <div className={Css['item']} >
                        <div className={Css['icon'] + ' ' +Css['review']}></div>
                        <div className={Css['title']}>待评价</div>
                    </div>
                </div>

                <div className={Css['detail-wrap']}>
                    <div className={Css['item']} onClick={this.pushPage.bind(this, 'user/userinfo')}>
                        <div className={Css['title']}>个人资料</div>
                        <div className={Css['go']}>&gt;</div>
                    </div>
                    <div className={Css['item']} onClick={this.pushPage.bind(this, 'user/address')}>
                        <div className={Css['title']}>收货地址</div>
                        <div className={Css['go']}>&gt;</div>
                    </div>
                    <div className={Css['item']} onClick={this.pushPage.bind(this, 'user/changepsw')}>
                        <div className={Css['title']}>修改密码</div>
                        <div className={Css['go']}>&gt;</div>
                    </div>
                    <div className={Css['item']} onClick={this.pushPage.bind(this, 'user/mark')}>
                        <div className={Css['title']}>我的收藏</div>
                        <div className={Css['go']}>&gt;</div>
                    </div>
                </div>
                
                <div className={Css['outLogin']} onClick={this.outLogin.bind(this)}>退出登录</div>
            </div>
        );
    }
}

export default connect((state) => {
    return{
        state
    }
})(userIndex)