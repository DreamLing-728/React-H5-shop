/*eslint-disable*/
import React from 'react';
import HeadComponent from '../../../components/head/head';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import { Toast } from 'antd-mobile';
import Css from '../../../assets/css/home/login/index.css';
import action from '../../../actions';
import { connect } from 'react-redux';
class LoginIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cellphone: '',  // 手机号
            password: '',   // 密码
            passwordType: 'password',   // 密码默认密文
            passwordChecked: false,     // false: 密文，true: 明文

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
        })
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
        if (this.state.cellphone.match(/^\s*$/)) {
            Toast.info('账号为空');
            return 0;
        }

        // 检查账号：是否是手机号
        if (!this.state.cellphone.match(/^1\d{10}$/)) {
            Toast.info('请正确输入手机号');
            return 0;
        }

        // 检查账号：是否注册过
        let resData = await this.checkUser();
        if (resData.code === 200) {
            if (parseInt(resData.data.isreg) === 0) {
                Toast.info('登录失败，此账号没有注册过');
                return 0;
            }
        }


        // 检查密码：是否为空
        if (this.state.password.match(/^\s*$/)) {
            Toast.info('密码为空，重新输入');
            return 0;
        }

        // 通过所有检查：可以登录
        let sUrl = config.baseUrl + '/api/home/user/pwdlogin?token=1ec949a15fb709370f'
        request(sUrl, 'post', {
            cellphone: this.state.cellphone,
            password: this.state.password
        }).then((res) => {
            // console.log('登录成功！', res);
            localStorage['uid'] = res.data.uid;
            localStorage['nickname'] = res.data.nickname;
            localStorage['auth_token'] = res.data.auth_token;
            localStorage['isLogin'] = true;
            this.props.dispatch(action.user.login(
                {
                    uid: res.data.uid,
                    nickname: res.data.nickname,
                    auth_token: res.data.auth_token,
                    isLogin: true
                }
            ))
            this.props.history.goBack();
        })
    }

    // 接口：判断是否注册过会员
    checkUser() {
        let sUrl = config.baseUrl + '/api/home/user/isreg?token=1ec949a15fb709370f';
        return request(sUrl, 'post', { username: this.state.cellphone }).then((res) => {
            return res
        })
    }

    // 密码明文还是密文
    passwordChecked() {
        let type;
        type = this.state.passwordCheck ? 'text' : 'password';
        return type;
    }

    // 跳转注册页
    goReg(url) {
        this.props.history.push(config.path + url);
    }

    render() {
        // console.log('page-login', this.props);
        return (
            <div className={Css['page']}>
                <div>
                    <HeadComponent title="会员登录"></HeadComponent>
                    <div className={Css['main']}>
                        <div className={Css['username-wrap']}>
                            <input placeholder="手机号：16677778888" onChange={(e) => { this.setPhone(e) }}></input>
                        </div>
                        <input type={this.state.passwordType} className={Css['password']} placeholder="密码：77778888" onChange={(e) => { this.setPassword(e) }}></input>
                        <button className={Css['register']} onClick={this.regUser.bind(this)}>登录</button>
                    </div>
                </div>
                <div className={Css['bottom-wrap']}>
                    <div className={Css['forgetPsw']}>
                        <div className={Css['icon']}></div>
                        忘记密码
                    </div>
                    <div onClick={this.goReg.bind(this, "reg/index")} className={Css['goReg']}>
                        <div className={Css['icon']}></div>
                        会员注册
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state
    }
})(LoginIndex)