/*eslint-disable*/
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Css from '../../../assets/css/home/goods/detail.css';
import config from '../../../assets/js/conf/config';
import Swiper from '../../../assets/js/libs/swiper.min.js';
import { request } from '../../../assets/js/libs/request';
import asyncComponents from '../../../components/async/AsyncComponent';
const DetailsContent = asyncComponents(() => (import('../goods/detail_content')));
const DetailsReview = asyncComponents(() => (import('../goods/detail_review')));
const DetailsItem = asyncComponents(() => (import('../goods/detail_item')));
import '../../../assets/css/common/swiper.min.css';
export default class GoodsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aGid : this.props.location.search.split('=')[1]
        }
    }
    componentDidMount() {
        
    }
    



    // 返回
    goBack = () => {
        this.props.history.goBack();
    }

    // 子路由页面
    goRoute(url){
        // console.log('detail')
        this.props.history.replace(url)
    }

    render() {
        // console.log('detail', this.props)
        return (
            <div className={Css['detail-wrap']}>
                {/* 顶部 */}
                <div className={Css['top-wrap']}>
                    <div className={Css['back-icon']} onClick={this.goBack}></div>
                    <div className={Css['goods']} onClick={this.goRoute.bind(this, config.path + 'goods/details/item?gid=' + this.state.aGid)}>商品</div>
                    <div className={Css['detail']} onClick={this.goRoute.bind(this, config.path + 'goods/details/content?gid=' + this.state.aGid)}>详情</div>
                    <div className={Css['comment']} onClick={this.goRoute.bind(this, config.path + 'goods/details/review?gid=' + this.state.aGid)}>评价</div>
                    <div className={Css['cart-icon']}></div>
                </div>

                
                
                {/* 路由页面 */}
                <div className={['sub-page']}>
                    <Switch>
                        <Route path={config.path + 'goods/details/content'} component={DetailsContent}></Route>
                        <Route path={config.path + 'goods/details/review'} component={DetailsReview}></Route>
                        <Route path={config.path + 'goods/details/item'} component={DetailsItem}></Route>
                        <Redirect to={config.path + 'goods/details/item'}></Redirect>
                    </Switch>
                </div>
            </div>
        );
    }
}