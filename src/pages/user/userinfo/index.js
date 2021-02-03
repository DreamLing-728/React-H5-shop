import React from 'react';
import { connect } from 'react-redux';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/userinfo/index.css';
import config from '../../../assets/js/conf/config';
import { request } from '../../../assets/js/libs/request';
import { Picker, Toast} from 'antd-mobile';
class UserinfoIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: this.props.state.user.uid,
            head: '',
            headName: '',
            nickname: '',
            gender: 1,
            
        }
        this.genderSelectValue = [
            { value: '1', label: '男' },
            { value: '2', label: '女' }
        ]
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        let url = config.baseUrl + '/api/user/myinfo/userinfo/uid/' + this.state.uid + '?token=' + config.token
        request(url, 'get').then((res) => {
            console.log('userinfo-res', res);
            if (res.code === 200) {
                this.setState({
                    head: res.data.head,
                    nickname: res.data.nickname,
                    gender: res.data.gender
                })
            }
        })
    }

    // 上传头像
    uploadHead() {
        let url = config.baseUrl + '/api/user/myinfo/formdatahead?token=' + config.token;
        let pramas = { headfile: this.refs['headfile'].files[0] }
        console.log('user-userinfo-pramsa', pramas);
        request(url, 'file', pramas).then((res) => {
            console.log('user-userinfo-res', res);
            if (res.code === 200) {
                this.setState({
                    head: '//vueshop.glbuys.com/userfiles/head/' + res.data.msbox,
                    headName: res.data.msbox
                })
            }
        })
    }

    // 保存信息
    saveChange() {
        // 如果昵称为空，不允许提交
        if(this.state.nickname.match(/^\s*$/)){
            Toast.info('昵称为空，请重新输入');
            return 0;
        }
        
        let url = config.baseUrl + '/api/user/myinfo/updateuser?token=' + config.token;
        let pramas = {
            uid: this.state.uid,
            nickname: this.state.nickname,
            gender: this.state.gender,
            head: this.state.headName
        }
        request(url, 'post', pramas).then((res) => {
            console.log('user-userinfo-savechange', res);
            if(res.code === 200) {
                this.props.history.goBack()
            } else {
                Toast.info(res.data);
            }
        })
    }


    render() {
        console.log('userinfo-this.props', this.props)
        return (
            <div className={Css['page']}>
                <HeadComponent title='个人资料' rightText='保存' rightClick={this.saveChange.bind(this)}></HeadComponent>
                <div className={Css['item']}>
                    <div className={Css['title']}>头像</div>
                    <div className={Css['icon']}>
                        <img src={this.state.head} alt='头像' />
                        <input ref='headfile' type='file' onChange={this.uploadHead.bind(this)} />
                    </div>
                </div>
                <div className={Css['item']}>
                    <div className={Css['title']}>昵称</div>
                    <input value={this.state.nickname} className={Css['input-value']} onChange={(e) => { this.setState({ nickname: e.target.value }) }}></input>
                </div>
                <div className={Css['item']}>

                    <div className={Css['title']}>性别</div>
                    <Picker
                        data={this.genderSelectValue}
                        title='性别'
                        cols={1}
                        onOk={e => {
                            console.log('Picker', e)
                            this.setState({ gender: e })
                        }}
                    >
                        <div className={Css['value']}>
                            {this.state.gender > 1 ? 
                                <div>女</div> 
                            : <div>男</div>}
                        </div>
                    </Picker>
                </div>
            </div>
        )
    }
}
export default connect((state) => {
    return {
        state: state
    }
})(UserinfoIndex)

