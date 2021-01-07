import React from 'react';
import Css from '../../../assets/css/home/reg/index.css';
import HeadComponent from '../../../components/head/head';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import { Toast } from 'antd-mobile';
export default class RegIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vcode: '',  // 验证码
            cellphone: '',  // 手机号
            password: '',   // 密码
            passwordType: 'password',   // 密码默认密文
            passwordChecked: false,     // false: 密文，true: 明文
            vcodeBt: false,
            vcodeText: '获取短信验证码',

        }
        // 同步的数据
        this.timer = null;
        this.bSendCode = true;
    }

    componentDidMount() {

    }

    // 手机号: 验证手机号的格式
    setPhone(e) {
        let input = e.target.value
        this.setState({
            cellphone: input,
        }, () => {
            if (this.bSendCode) {
                if (this.state.cellphone.match(/^1\d{10}$/)) {
                    this.setState({
                        vcodeBt: true
                    })
                } else {
                    this.setState({
                        vcodeBt: false
                    })
                }
            }
        })
    }

    // 设置验证码
    setVcode(e) {
        this.setState({
            vcode: e.target.value,
        })
    }

    // 点击获取验证码
    getVcode() {
        if (this.state.vcodeBt) {
            let iTimer = 10;
            this.timer = setInterval(() => {
                if (iTimer > 0) {
                    iTimer --;
                    this.setState({
                        vcodeText: `重新发送(${iTimer}s)`,
                        vcodeBt: false

                    })
                } else {
                    clearInterval(this.timer);
                    this.setState({
                        vcodeText: '获取短信验证码',
                        vcodeBt: true
                    })
                }
            }, 1000)
        }
    }

    // 密码
    setPassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    // 接口：会员注册
    async regUser() {
        // 检查账号：是否为空
        if(this.state.cellphone.match(/^\s*$/)){
            Toast.info('账号为空');
            return 0;
        }

        // 检查账号：是否是手机号
        if(!this.state.cellphone.match(/^1\d{10}$/)){
            Toast.info('请正确输入手机号');
            return 0;
        }

        // 检查账号：是否注册过
        let resData = await this.checkUser();
        if(resData.code === 200){
            if(parseInt(resData.data.isreg) === 1){
                Toast.info('此账号已注册过');
                return 0;
            } 
        }

        // 检查验证码：是否为空
        if(this.state.vcode.match(/^\s*$/)){
            Toast.info('验证码为空，重新输入');
            return 0;
        }

        // 检查密码：是否为空
        if(this.state.password.match(/^\s*$/)){
            Toast.info('密码为空，重新输入');
            return 0;
        }

        // 通过所有检查：可以注册
        let sUrl = config.baseUrl + '/api/home/user/reg?token=1ec949a15fb709370f'
        request(sUrl, 'post', {
            vcode: this.state.vcode,
            cellphone: this.state.cellphone,
            password: this.state.password
        }).then((res) => {
            console.log('注册成功');
            this.props.history.goBack();
        })
    }

    // 接口：判断是否注册过会员
    checkUser() {
        let sUrl = config.baseUrl + '/api/home/user/isreg?token=1ec949a15fb709370f';
        return request(sUrl, 'post', {username: this.state.cellphone}).then((res) => {
            return res
        })
    }

    // 密码明文还是密文
    passwordChecked() {
        let type;
        type = this.state.passwordCheck ? 'text' : 'password';
        return type;
    }


    render() {
        // console.log('reg-render', this.state.cellphone)
        return (
            <div className={Css['page']}>
                <HeadComponent title="会员注册"></HeadComponent>
                <div className={Css['main']}>
                    <div className={Css['username-wrap']}>
                        <input placeholder="请输入手机号" onChange={(e) => { this.setPhone(e) }}></input>
                        <div className={this.state.vcodeBt ? Css['get-messagecode'] + ' ' + Css['checked'] : Css['get-messagecode']} onClick={this.getVcode.bind(this)}>{this.state.vcodeText}</div>
                    </div>
                    <input className={Css['messagecode']} placeholder='输入验证码' onChange={(e) => { this.setVcode(e) }}></input>
                    <input type={this.state.passwordType} className={Css['password']} placeholder="请输入密码" onChange={(e) => { this.setPassword(e) }}></input>
                    <button className={Css['register']} onClick={this.regUser.bind(this)}>注册</button>
                </div>
            </div>
        );
    }
}