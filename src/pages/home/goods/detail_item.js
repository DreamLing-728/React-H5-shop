/*eslint-disable*/
import React from 'react';
import Css from '../../../assets/css/home/goods/detail_item.css';
import config from '../../../assets/js/conf/config';
import Swiper from '../../../assets/js/libs/swiper.min.js';
import action from '../../../actions';
import { Toast } from 'antd-mobile';
import { request } from '../../../assets/js/libs/request';
import { connect } from 'react-redux';
class DetailsItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aSwiperImg: [], // 轮播图
            aTitle: '',     // 商品名称
            aPrice: '',     // 价格
            aSales: '',     // 销量
            aExpress: '',   // 运费     
            aReview: '',    // 商品评价
            attrs: '',
            aColor: '',     // 颜色属性
            aSize: '',      // 大小属性
            showMask: false,    // 蒙版
            showScreen: false,  // 属性弹框
            screenStatus: '',   // 弹框动态、弹入、弹出
            count: 1,       // 加购数量
            gid: this.props.location.search.split('=')[1],   //// 商品编号
            uid: this.props.state.user.uid      // 用户id
        }
    }
    componentDidMount() {
        this.getGoodsData();
        this.getReviewData();
        this.getGoodsType();
    }

    // 获取商品数据
    getGoodsData = () => {
        request(config.baseUrl + '/api/home/goods/info?gid=' + this.state.gid + '&type=details&token=1ec949a15fb709370f').then((res) => {
            // console.log('detail_item', res);
            this.setState({
                aSwiperImg: res.data.images,
                aTitle: res.data.title,
                aPrice: res.data.price,
                aSales: res.data.sales,
                aExpress: res.data.freight,
                gid: res.data.gid
            }, () => {
                new Swiper('.' + Css['swiper-wrap'], {
                    autoplay: 3000,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false,
                    paginationClickable: true,
                })
            })
        })
    }

    // 获取评价数据
    getReviewData = () => {
        request(config.baseUrl + '/api/home/reviews/index?gid=' + this.state.gid + '&token=1ec949a15fb709370f&page=1').then((res) => {
            // console.log('detail_item_res', res)
            if (res.code === 200) {
                this.setState({
                    aReview: res.data
                })
            }
        })
    }

    // 获取商品规格数据
    getGoodsType = () => {
        request(config.baseUrl + '/api/home/goods/info?gid=' + this.state.gid + '&type=spec&token=1ec949a15fb709370f').then((res) => {

            if (res.code === 200) {
                // console.log('detail_item_getGoodsType', res);
                let aColorTemp = res.data.length > 0 ? res.data[0].values : [];
                let aSizeTemp = res.data.length > 1 ? res.data[1].values : [];
                aColorTemp.forEach(item => {
                    item['active'] = false
                });
                aSizeTemp.forEach(item => {
                    item['active'] = false
                });
                this.setState({
                    attrs: res.data,
                    aColor: aColorTemp,
                    aSize: aSizeTemp
                })
            }
        })
    }

    // 弹出蒙版和加购
    showMaskScreen() {
        this.setState({
            showMask: true,
            showScreen: true,
            screenStatus: Css['move']
        })
    }

    // 隐藏蒙版和架构
    hideMaskScreen() {
        this.setState({
            showMask: false,
            showScreen: false,
            screenStatus: Css['unmove']
        })
    }

    // 数量减少
    moveCount() {
        if (this.state.count > 0) {
            let countTemp = this.state.count - 1;
            this.setState({
                count: countTemp
            })
        }
    }

    // 数量增加
    addCount() {
        let countTemp = this.state.count + 1;
        this.setState({
            count: countTemp
        })
    }

    // 选中颜色
    selectColor(index) {
        let aColorTemp = this.state.aColor
        for (let i = 0; i < aColorTemp.length; i++) {
            if (i === index) {
                aColorTemp[i].active = true;
            } else {
                aColorTemp[i].active = false;
            }
        }
        this.setState({ aColor: aColorTemp })
    }

    // 选中尺寸
    selectSize(index) {
        let aSizeTemp = this.state.aSize
        for (let i = 0; i < aSizeTemp.length; i++) {
            if (i === index) {
                aSizeTemp[i].active = true;
            } else {
                aSizeTemp[i].active = false;
            }
        }
        this.setState({ aSize: aSizeTemp })
    }

    // 加入购物车
    addCart() {
        // 如果没有选属性：土司条提示(可以优化)
        let colorTemp = 0, sizeTemp = 0;
        // console.log('detail_item', this.state.aColor)
        for(let i = 0; i < this.state.aColor.length; i++){
            if(!this.state.aColor[i].active){
                colorTemp ++;
            }
        }
        for(let i = 0; i < this.state.aSize.length; i++){
            if(!this.state.aSize[i].active){
                sizeTemp ++;
            }
        }
        if(colorTemp === this.state.aColor.length || sizeTemp === this.state.aSize.length){
            Toast.info('请选择属性');
            return false;
        }


        // 如果购物车有相同的：修改localstorage，数量总价变化
        // let aCartData = this.props.state.cart.aCartData;
        // console.log('detail_item_addCart', aCartData);
        // here:
        // for (let i = 0; i < aCartData.length; i++) {
        //     // 如果商品编码相同：判断规格是否相同
        //     if (aCartData[i].gid === this.state.gid) {
        //         console.log('是相同的商品')
        //         for(let j = 0; j < aCartData[i].attrs.length; j++){
        //             console.log('detail_item_addCart-aCartData[i][j]',aCartData[i].attrs[j])
        //             for(let k = 0; k < aCartData[i].attrs[j].values.length; k++){
        //                 while(aCartData[i].attrs[j].values[k].active) {
        //                     // 如果颜色和尺码其中给一个相同，则直接退出最外层
        //                     if(this.state.aColor !== aCartData[i].attrs[j].values[k].value || this.state.aSize !== aCartData[i].attrs[j].values[k].value){
        //                         console.log('是相同的商品,属性不同，可以新增！')
        //                         break here;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }


        // 都不符合上述：新加入购物车
        console.log('detail_item_express', this.props)

        this.props.dispatch(action.cart.addCart({
            gid: this.state.gid,
            title: this.state.aTitle,
            amount: this.state.count,
            price: this.state.aPrice,
            img: this.state.aSwiperImg[0],
            checked: true,
            freight: this.state.aExpress,
            attrs: this.state.attrs
        }))
    }

    // 加入收藏
    addMark() {
        let url = config.baseUrl + '/api/goods/fav?uid=' + this.state.uid + '&gid=' + this.state.gid + '&token=' + config.token;
        request(url, 'get').then((res) => {
            console.log('goods-detail-item-addmark', res);
            if(res.code === 200) {
                Toast.info('收藏成功！')
            } else {
                Toast.info(res.data)
            }
        })
    }

    render() {
        // console.log('detail_item', this.props);
        return (
            <div className={Css['page']}>
                <div className={Css['detail-item']}>
                    {/* 轮播图 */}
                    <div className={Css['swiper-wrap']}>
                        <div className="swiper-wrapper">
                            {this.state.aSwiperImg.length > 0 ?
                                this.state.aSwiperImg.map((item, index) => (
                                    <div key={index} className="swiper-slide">
                                        <img className={Css['swiper-img']} src={item}></img>
                                    </div>
                                ))
                                : ''
                            }
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                    {/* 商品标题 */}
                    <div className={Css['goods-content-wrap']}>
                        <div className={Css['title']}>{this.state.aTitle}</div>
                        <div className={Css['price']}>￥{this.state.aPrice}</div>
                        <div className={Css['express-sales']}>
                            <div className={Css['express']}>快递{this.state.aExpress}元</div>
                            <div className={Css['sales']}>月销量{this.state.aSales}件</div>
                        </div>
                    </div>

                    {/* 商品评价 */}
                    <div className={Css['review-wrap']}>
                        <div className={Css['title']}>商品评价</div>
                        {
                            this.state.aReview.length > 0 ?
                                this.state.aReview.map((item, index) => (
                                    <div className={Css['item-wrap']} key={index}>
                                        <div className={Css['user']}>
                                            <div className={Css['user-icon']}><img src={item.head}></img></div>
                                            <div className={Css['username']}>{item.nickname}</div>
                                        </div>
                                        <div className={Css['review']}>{item.content}</div>
                                        <div className={Css['time']}>2020-12-13 09:23:56</div>
                                    </div>
                                ))
                                : ''
                        }

                    </div>
                    <div className={Css['bottom-wrap']}>
                        <div className={Css['mark']} onClick={this.addMark.bind(this)}>收藏</div>
                        <div className={Css['cart']} onClick={this.showMaskScreen.bind(this)}>加入购物车</div>
                    </div>
                </div>



                {/* 蒙版 */}
                <div className={this.state.showMask ? Css['mask'] : Css['mask'] + 'hide'} onClick={this.hideMaskScreen.bind(this)}></div>
                <div className={this.state.showScreen ? Css['screen'] + ' ' + this.state.screenStatus : Css['screen']}>
                    <div className={Css['content-wrap']}>
                        <div className={Css['img']}>
                            <img src={this.state.aSwiperImg[0]}></img>
                        </div>
                        <div className={Css['title-wrap']}>
                            <div className={Css['title']}>
                                {this.state.aTitle}
                            </div>
                            <div className={Css['price-num']}>
                                <div className={Css['price']}>￥{this.state.aPrice}</div>
                                <div className={Css['num']}>商品编号{this.state.gid}</div>
                            </div>
                        </div>
                    </div>
                    <div className={Css['color-wrap']}>
                        <div className={Css['title']}>颜色</div>
                        <div className={Css['select-wrap']}>
                            {this.state.aColor.length > 0 ?
                                this.state.aColor.map((item, index) => (
                                    <div className={item.active ? Css['item'] + ' ' + Css['active'] : Css['item']} key={index} onClick={this.selectColor.bind(this, index)}>{item.value}</div>
                                ))
                                : ''}
                        </div>
                    </div>
                    <div className={Css['color-wrap']}>
                        <div className={Css['title']}>尺寸</div>
                        <div className={Css['select-wrap']}>
                            {this.state.aSize.length > 0 ?
                                this.state.aSize.map((item, index) => (
                                    <div className={item.active ? Css['item'] + ' ' + Css['active'] : Css['item']} key={index} onClick={this.selectSize.bind(this, index)}>{item.value}</div>
                                ))
                                : ''}
                        </div>
                    </div>
                    <div className={Css['count-wrap']}>
                        <div className={Css['title']}>购买数量</div>
                        <div className={Css['count']}>
                            <div className={Css['action']} onClick={this.moveCount.bind(this)}>-</div>
                            <div className={Css['num']}>{this.state.count}</div>
                            <div className={Css['action']} onClick={this.addCount.bind(this)}>+</div>
                        </div>
                    </div>
                    <div className={Css['commit']} onClick={this.addCart.bind(this)}>确定</div>
                </div>
            </div>

        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(DetailsItem)