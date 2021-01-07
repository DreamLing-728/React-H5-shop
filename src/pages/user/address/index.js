import React from 'react';
import { connect } from 'react-redux';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/address/index.css';
import config from '../../../assets/js/conf/config';
import { request } from '../../../assets/js/libs/request';
class UserAddreIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            addressData: [],
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        let url = config.baseUrl + '/api/user/address/index?uid=' + this.state.uid + '&token=' + config.token;
        request(url, 'get').then((res) => {
            console.log('user-address-res', res);
            if (res.code === 200) {
                this.setState({
                    addressData: res.data
                })
            }
        })
    }
    // 编辑收货地址
    editAddress(url, aid) {
        this.props.history.push(config.path + url + '?aid=' + aid);
    }
    // 新增收货地址
    addAddress(url) {
        this.props.history.push(config.path + url);
    }
    render() {
        // console.log('address-this.props', this.state.addressData)
        return (
            <div className={Css['page']}>
                <HeadComponent title='地址管理' rightText='新增' rightClick={this.addAddress.bind(this, 'address/add')}></HeadComponent>
                {this.state.addressData.length > 0 ?
                    this.state.addressData.map((item, index) => (
                        <div key={index} className={Css['item']} onClick={this.editAddress.bind(this, 'address/edit', item.aid)}>
                            <div className={Css['content-wrap']}>
                                <div className={Css['name-phone-wrap']}>
                                    <div className={Css['name']}>{item.name}</div>
                                    <div className={Css['phone']}>{item.cellphone}</div>
                                </div>
                                <div className={Css['address-wrap']}>
                                    {item.isdefault > 0 ? 
                                        <div className={Css['default']}>[默认]</div>
                                    : ''
                                    }
                                    <div className={Css['address']}>{item.province + item.city + item.area + item.address}</div>
                                </div>
                            </div>
                            <div className={Css['detail-icon']}></div>
                        </div>
                    ))
                : '还没有地址哦，请添加'
                }

            </div>
        )
    }
}
export default connect((state) => {
    return {
        state: state
    }
})(UserAddreIndex)

