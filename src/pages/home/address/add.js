import React from 'react';
import HeadComponent from '../../../components/head/head';
import { connect } from 'react-redux';
import Css from '../../../assets/css/home/address/add.css';
import { Picker } from 'antd-mobile';
import { province } from '../../../assets/data/province';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
class AddressAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultProvince: '',
            uid: this.props.state.user.uid,    // 用户id
            name: '',   // 收货人
            cellphone: '',     // 收货手机号
            province: '',
            city: '',
            area: '',
            address: '',
            isdefault: true
        }
    }
    // componentDidMount(){

    // }

    // 点击添加
    addAddress() {
        let sUrl = config.baseUrl + '/api/user/address/add?token=1ec949a15fb709370f';
        let params = {
            uid: this.state.uid,
            name: this.state.name,
            cellphone: this.state.cellphone,
            province: this.state.province,
            city: this.state.city,
            area: this.state.area,
            address: this.state.address,
            isdefault: this.state.isdefault ? '1' : '0'
        }
        request(sUrl, 'post', params).then((res) => {
            console.log('addAddress-res', res);
            if(res.code === 200) {
                if(this.state.isdefault) {
                    localStorage['addressId'] = res.data.aid;
                    this.props.history.goBack();
                }
            }
        })
    }

    // 设置收货人
    setName(e) {
        this.setState({ name: e.target.value })
    }

    // 设置收货人电话
    setCellphone(e) {
        this.setState({ cellphone: e.target.value })
    }

    // 设置收货详细地址：门牌号
    setAddress(e) {
        this.setState({ address: e.target.value })
    }

    // 设置收货是否默认
    setIsdefault() {
        let isdefault = !this.state.isdefault;
        this.setState({ isdefault: isdefault })
    }

    

    render() {
        console.log('address-add', this.state.isdefault);
        return (
            <div className={Css['page']}>
                <HeadComponent title='添加收货地址'></HeadComponent>
                <div className={Css['main']}>
                    <ul>
                        <li className={Css['title']}>收货人</li>
                        <li className={Css['input']}>
                            <input placeholder='请输入收货人' onChange={(e) => { this.setName(e) }}></input>
                        </li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>联系方式</li>
                        <li className={Css['input']}><input placeholder='请输入联系方式' onChange={(e) => { this.setCellphone(e) }}></input></li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>选择地址</li>
                        <li className={Css['input']}>
                            <Picker
                                data={province}
                                title="Areas"
                                onOk={e => {
                                    this.setState({
                                        defaultProvince: e.join(" "),
                                        province: e[0],
                                        city: e[1],
                                        area: e[2] !== undefined ? e[2] : ''
                                    })
                                }}
                            >
                                <input placeholder='请输入地址' value={this.state.defaultProvince} readOnly></input>
                            </Picker>
                        </li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>详细地址</li>
                        <li className={Css['input']} onChange={(e) => { this.setAddress(e) }}><input placeholder='请输入详细地址'></input></li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>设为默认地址</li>
                        <li className={Css['input']}>
                            <input type='checkbox' checked={this.state.isdefault} className={Css['checkbox']} onChange={(e) => {this.setIsdefault()}}>
                            </input>
                        </li>
                    </ul>
                </div>
                <div className={Css['add-btn']} onClick={this.addAddress.bind(this)}>添加</div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state
    }
})(AddressAdd)