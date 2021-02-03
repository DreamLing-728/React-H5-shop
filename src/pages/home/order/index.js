/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import actions from '../../../actions';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/home/order/index.css';
import { Toast } from 'antd-mobile';
class orderIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderData: this.props.state.cart,
            total: this.props.state.cart.total,
            freight: this.props.state.cart.freight,
            uid: localStorage['uid'],
            aid: localStorage['addressId'],
            name: '',
            cellphone: '',
            address: '',
            initAddress: '未设置地址，去设置！'
        }
    }
    componentDidMount() {
        this.getAddress();
        this.getOrderData();
    }

    // 获取需要下单的商品
    getOrderData() {
        let orderDataTemp = this.props.state.cart.aCartData.filter((item) => {
            return item.checked
        })
        console.log('order-index-orderDataTemp', orderDataTemp);
        this.setState({
            orderData: orderDataTemp
        })
    }

    // 获取默认地址
    getDefaultAddress() {
        let sUrl = config.baseUrl + '/api/user/address/defaultAddress?uid=' + this.state.uid + '&token=' + config.token;
        request(sUrl, 'get').then((res) => {
            console.log('order-index-res', res)
            if (res.code === 200) {
                let resAddress = res.data.province + '' + res.data.city + '' + res.data.area + '' + res.data.address;
                this.setState({
                    name: res.data.name,
                    cellphone: res.data.cellphone,
                    address: resAddress
                })
            }
        })
    }

    // 获取收货地址
    getAddress() {
        let sUrl = config.baseUrl + '/api/user/address/info?uid=' + this.state.uid + '&aid=' + this.state.aid + '&token=' + config.token;
        request(sUrl, 'get').then((res) => {
            if (res.code === 200) {
                let resAddress = res.data.province + '' + res.data.city + '' + res.data.area + '' + res.data.address;
                this.setState({
                    name: res.data.name,
                    cellphone: res.data.cellphone,
                    address: resAddress
                })
            } else {
                this.getDefaultAddress()
            }
        })
    }


    // 跳转选择地址页面
    pushPage(sUrl) {
        this.props.history.push(sUrl);
    }

    // 提交订单
    submitOrder() {
        if(this.state.address === ''){
            Toast.info('地址为空！');
            return false;   
        }
        let url = config.baseUrl + '/api/order/add?token=' + config.token;
        let pramas = {
            uid: this.state.uid,
            freight: this.state.cart.freight,
            addsid: localStorage['addressId'],
            goodsData: JSON.stringify(this.state.cart.aCartData)
        }
        request(url, 'post', pramas).then((res) => {
            // console.log('home-order-index', res)
            if(res.code === 200){
                this.pushPage('/order/end');
            }
        })
    }


    render() {
        console.log('order', this.props.state.cart)
        return (
            <div className={['page']}>
                <HeadComponent title='确认订单'></HeadComponent>
                <div className={Css['top-wrap']} onClick={this.pushPage.bind(this, '/address/index')}>
                    <div className={Css['loca-icon']}></div>

                    {this.state.name === ''
                        ?
                        <div>{this.state.initAddress}</div>
                        : <div className={Css['content']}>
                            <div className={Css['user-wrap']}>
                                <div className={Css['username']}>{this.state.name}</div>
                                <div className={Css['tel']}>{this.state.cellphone}</div>
                            </div>
                            <div className={Css['location']}>{this.state.address}</div>
                        </div>
                    }


                    <div className={Css['detail-icon']}></div>
                </div>
                <div className={Css['items-wrap']}>
                    {
                        this.state.orderData.length > 0 ?
                            this.state.orderData.map((item, index) => (
                                <div className={Css['item-wrap']} key={index}>
                                    <div className={Css['img']}><img src={item.img}></img></div>
                                    <div className={Css['content-wrap']}>
                                        <div className={Css['title']}>{item.title}</div>

                                        <div className={Css['types-wrap']}>
                                            {item.attrs.map((item1, index1) => (
                                                <div className={Css['type-wrap']} key={index1}>
                                                    <div className={Css['title']}>{item1.title}:</div>
                                                    <div className={Css['attr']}>{
                                                        item1.values.map((item2, index2) => {
                                                            if (item2.active) {
                                                                return <div key={index2}>{item2.value}</div>
                                                            }
                                                        })
                                                    }</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={Css['count']}>x{item.amount}</div>
                                        <div className={Css['price']}>￥{item.price}</div>
                                    </div>
                                </div>
                            ))
                            : <div>订单为0</div>
                    }
                </div>
                <div className={Css['total-wrap']}>
                    <div className={Css['total']} id='goods-total'>
                        <div>商品总额</div>
                        <div>{this.state.total}</div>
                    </div>
                    <div className={Css['total']} id='express'>
                        <div>运费</div>
                        <div>{this.state.freight}</div>
                    </div>
                </div>
                <div className={Css['bottom-wrap']}>
                    <div className={Css['title']}>实际金额：</div>
                    <div className={Css['price-pay']}>￥{parseFloat(this.state.total) + parseFloat(this.state.freight)}</div>
                    <div className={Css['submit']} onClick={this.submitOrder.bind(this)}>提交订单</div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state
    }
})(orderIndex)