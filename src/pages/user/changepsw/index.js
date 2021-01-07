import React from 'react';
import { connect } from 'react-redux';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/changepsw/index.css';
import config from '../../../assets/js/conf/config';
import { request } from '../../../assets/js/libs/request';
import { Toast } from 'antd-mobile';
class ChangePswIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            password: '',
        }
    }
    
    submitChange(){
        // 如果密码输入为空
        if(this.state.password.match(/^\s*$/)) {
            Toast.info('密码为空，重新输入');
            return 0;
        }
        // 如果密码小于6位
        if(this.state.password.length < 6) {
            Toast.info('密码长度小于6位，重新输入');
            return 0;
        }
        let url = config.baseUrl + '/api/home/user/modpwd?token=' + config.token;
        let pramas = {
            uid: this.state.uid,
            pwd: this.state.password
        }
        request(url, 'post', pramas).then((res) => {
            console.log('user-changepsw-res', res);
            if(res.code === 200){
                Toast.info('修改成功');
                this.props.history.goBack();
            }
        })
    }

    render() {
        // console.log('address-this.props', this.state.addressData)
        return (
            <div className={Css['page']}>
                <HeadComponent title='修改密码'></HeadComponent>
                <input className={Css['psw-input']} type='password' onChange={(e) => {this.setState({password: e.target.value})}}></input>
                <div className={Css['submit']} onClick={this.submitChange.bind(this)}>提交</div>
            </div>
        )
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(ChangePswIndex)

