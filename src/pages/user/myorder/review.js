/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import actions from '../../../actions';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/myorder/index.css';
class  ReviewPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            nickname: '',
            points: 0
        }
    }
    componentDidMount(){
    }

    render(){
        return(
            <div className={['page']}>
                <HeadComponent title='我的全部订单'></HeadComponent>
                <div className={Css['nav-wrap']}>
                    <div className={Css['item']}>全部订单</div>
                    <div className={Css['item']}>待付款</div>
                    <div className={Css['item']}>待收货</div>
                    <div className={Css['item']}>待评价</div>
                </div>
                <div>评价页面</div>
            </div>
        );
    }

}

export default connect((state) => {
    return{
        state
    }
})(ReviewPage)