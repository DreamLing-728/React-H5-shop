/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import actions from '../../../actions';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/myorder/order.css';
class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.location.search.split('=')[1],
            uid: this.props.state.user.uid,
            page: 1,
            orderData: [],
            nickname: '',
            points: 0
        }
    }

    componentDidMount() {
        this.getData()
    }

    componentWillReceiveProps(newProps) {
        // console.log('myorder-order-newProps', newProps.location.search.split('=')[1]);
        this.setState({
            status: newProps.location.search.split('=')[1],
        }, () => {
            this.getData()
        })
    }
    

    getData() {
        let url = config.baseUrl + '/api/user/myorder/index?uid=' + this.state.uid + '&status=' + this.state.status + '&token=' + config.token + '&page=' + this.state.page;
        console.log('myorder-order-request-url', url);
        request(url, 'get').then((res) => {
            // console.log('myorder-order-res', res);
            if (res.code === 200) {
                this.setState({ orderData: res.data })
            } else {
                this.setState({ orderData: []})
            }
        })
    }

    // 跳转页面
    pushPage(url, ordernum) {
        this.props.history.push(config.path + url + ordernum)
    }

    // 取消订单
    cancelOrder(ordernum) {
        let url = config.baseUrl + '/api/user/myorder/clearorder?uid=' + this.state.uid + '&ordernum=' + ordernum + '&token=' + config.token;
        request(url, 'get').then((res) => {
            console.log('myorder-order-cancelorder', res)
        })
    }



    render() {
        // console.log('myorder-order-status', this.state.status)
        return (
            <div className={['page']}>
                {
                    this.state.orderData.length > 0 ?
                        this.state.orderData.map((item, index) => (
                            <div className={Css['item']} key={index} onClick={this.pushPage.bind(this, 'myorder/detail?ordernum=', item.ordernum)}>
                                <div className={Css['order-num']}>
                                    <div>订单编号：{item.ordernum}</div>
                                    <div>待付款{item.status}</div>
                                </div>
                                {item.goods.map((item1, index1) => (
                                    <div key={index1} className={Css['content']}>
                                        <div className={Css['img']}><img src={item1.image}></img></div>
                                        <div className={Css['title-count']}>
                                            <div className={Css['title']}>{item1.title}</div>
                                            <div className={Css['count']}>X{item1.amount}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className={Css['pay-action']}>
                                    <div className={Css['pay']}>实付金额：{item.total}</div>
                                    <div className={Css['action']} onClick={this.cancelOrder.bind(this, item.ordernum)}>取消订单</div>
                                </div>
                            </div>
                        ))
                        : '暂无订单信息，去加购'
                }
                <div className={Css['bottom']}>我是有底线滴~~</div>
            </div>
        );
    }

}

export default connect((state) => {
    return {
        state
    }
})(OrderPage)