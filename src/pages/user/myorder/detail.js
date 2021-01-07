/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import actions from '../../../actions';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/myorder/detail.css';
class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            ordernum: this.props.location.search.split('=')[1],
            nickname: '',
            cellphone: '',
            province: '',
            city: '',
            area: '',
            address: '',
            total: '',
            truetotal: '',
            freight: '',
            ordertime: '',
            goods: []
        }
    }
    componentDidMount() {
        this.getData()
    }

    getData() {
        let url = config.baseUrl + '/api/user/myorder/desc?uid=' + this.state.uid + '&ordernum=' + this.state.ordernum + '&token=' + config.token;
        request(url, 'get').then((res) => {
            console.log('myorder-detail-res', res);
            if (res.code === 200) {
                this.setState({ 
                    nickname: res.data.name,
                    cellphone: res.data.cellphone,
                    province: res.data.province,
                    city: res.data.city,
                    area: res.data.area,
                    address: res.data.address,
                    goods: res.data.goods,
                    total: res.data.total,
                    truetotal: res.data.truetotal,
                    freight: res.data.freight,
                    ordertime: res.data.ordertime
                })
            }
        })

    }

    render() {
        console.log('myorder-detail', this.state.goods)
        return (
            <div className={Css['page']}>
                <HeadComponent title='订单详情'></HeadComponent>
                <div className={Css['order-num']}>订单编号：{this.state.ordernum}</div>
                <div className={Css['address-wrap']}>
                    <div className={Css['name-phone-wrap']}>
                        <div className={Css['name']}>{this.state.nickname}</div>
                        <div className={Css['phone']}>{this.state.cellphone}</div>
                    </div>
                    <div className={Css['address']}>{String(this.state.province + this.state.city + this.state.area + this.state.address)}</div>
                </div>
                <div className={Css['title']}>购买的宝贝</div>
                {
                    this.state.goods.length > 0 ? 
                        this.state.goods.map((item, index) => (
                            <div key={index} className={Css['item-wrap']}>
                                <div className={Css['img']}><img src={item.image}></img></div>
                                <div className={Css['content-wrap']}>
                                    <div className={Css['goods-title']}>{item.title}</div>
                                    <div className={Css['price']}>￥{item.price}</div>
                                    <div className={Css['attrs-wrap']}>
                                        <div className={Css['count']}>X{item.amount}</div>
                                        <div className={Css['attr']}>颜色：淡黄色</div>
                                        <div className={Css['attr']}>尺码：37</div>
                                    </div>
                                </div>
                            </div>
                        ))
                        : '没有订单'
                }
                <div id={Css['pay-status']} className={Css['status-wrap']}>
                    <div>支付状态</div>
                    <div>待付款</div>
                </div>
                <div id={Css['all-price']} className={Css['status-wrap']}>
                    <div>商品总额</div>
                    <div>￥{this.state.total}</div>
                </div>
                <div id={Css['express']} className={Css['status-wrap']}>
                    <div>运费</div>
                    <div>￥{this.state.freight}</div>
                </div>
                <div className={Css['bottom-wrap']}>
                    <div className={Css['pay']}>实付金额：￥{this.state.truetotal}</div>
                    <div className={Css['time']}>下单时间：{this.state.ordertime}</div>
                </div>
            </div>
        );
    }

}

export default connect((state) => {
    return {
        state
    }
})(OrderDetail)