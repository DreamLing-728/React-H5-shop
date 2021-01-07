import React from 'react';
import HeadComponent from '../../../components/head/head';
import { connect } from 'react-redux';
import Css from '../../../assets/css/home/address/add.css';
import { Picker } from 'antd-mobile';
import { province } from '../../../assets/data/province';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
class AddressEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultProvince: '',
            uid: this.props.state.user.uid,    // 用户id
            aid: this.props.location.search.split('=')[1],
            name: '',   // 收货人
            cellphone: '',     // 收货手机号
            province: '',
            city: '',
            area: '',
            address: '',
            isdefault: ''
        }
    }
    componentDidMount(){
        this.getAddress();
    }

    // 默认加载地址信息
    getAddress() {
        let url = config.baseUrl + '/api/user/address/info?uid=' + this.state.uid + '&aid=' + this.state.aid + '&token=' + config.token;
        // console.log('address-edit-url', url)
        request(url, 'get').then((res) => {
            // console.log('address-edit-res', res)
            if (res.code === 200) {
                this.setState({
                    name: res.data.name,
                    cellphone: res.data.cellphone,
                    province: res.data.province,
                    city: res.data.city,
                    area: res.data.area,
                    address: res.data.address !== undefined ? res.data.address : '',
                    isdefault: res.data.isdefault
                })
            }
        })
    }

    // 点击修改地址
    editAddress() {
        let sUrl = config.baseUrl + '/api/user/address/mod?token' + config.token;
        let params = {
            aid: this.state.aid,
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
                    // localStorage['addressId'] = res.data.aid;
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
        console.log('address-edit', this.props);
        return (
            <div className={Css['page']}>
                <HeadComponent title='编辑收货地址'></HeadComponent>
                <div className={Css['main']}>
                    <ul>
                        <li className={Css['title']}>收货人</li>
                        <li className={Css['input']}>
                            <input value={this.state.name} onChange={(e) => { this.setName(e) }}></input>
                        </li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>联系方式</li>
                        <li className={Css['input']}><input value={this.state.cellphone} onChange={(e) => { this.setCellphone(e) }}></input></li>
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
                                <input value={this.state.province + this.state.city + this.state.area } readOnly></input>
                            </Picker>
                        </li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>详细地址</li>
                        <li className={Css['input']} ><input value={this.state.address} onChange={(e) => { this.setAddress(e) }}></input></li>
                    </ul>
                    <ul>
                        <li className={Css['title']}>设为默认地址</li>
                        <li className={Css['input']}>
                            <input type='checkbox' checked={this.state.isdefault} className={Css['checkbox']} onChange={(e) => {this.setIsdefault()}} readOnly>
                            </input>
                        </li>
                    </ul>
                </div>
                <div className={Css['add-btn']} onClick={this.editAddress.bind(this)}>修改</div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state
    }
})(AddressEdit)