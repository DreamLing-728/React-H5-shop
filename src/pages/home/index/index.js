/*eslint-disable*/
import React from 'react';
import Css from '../../../assets/css/home/index/index.css';
import config from '../../../assets/js/conf/config';
import { request } from '../../../assets/js/libs/request';
import Swiper from '../../../assets/js/libs/swiper.min.js';
import '../../../assets/css/common/swiper.min.css';
import { lazyImg } from '../../../assets/js/utils/util.js';
import SearchComponent from '../../../components/search/search';
import { connect } from 'react-redux';
class IndexComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aNav: [],
            aSwiper: [],
            aGoods: [],
            aRecoGoods: [],
            bScroll: false,
            pageStyle: { display: 'none' },
            cid: 492,
            isLogin: this.props.state.user.isLogin
        }
        this.bScroll = true;
    }

    componentDidMount() {
        this.getNav();
        this.getSwiper();
        this.getGoods();
        this.getReco();
        // 监听scroll事件
        window.addEventListener("scroll", this.eventScroll.bind(this), false);
    }

    componentWillUnmount() {
        this.bScroll = false;
        window.removeEventListener("scroll", this.eventScroll.bind(this));
    }

    eventScroll() {
        if (this.bScroll) {
            // 获取滚动条的位置 || 网页被卷去的高度
            let iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            // console.log(iScrollTop);
            if (iScrollTop >= 80) {
                this.setState({ bScroll: true })
            } else {
                this.setState({ bScroll: false })
            }
        }
    }

    getNav() {
        // 1.fetch方式
        request(config.baseUrl + '/api/home/index/nav?token=' + config.token).then((res) => {
            if (res.code == 200) {
                this.setState({
                    aNav: res.data
                })
            }
        })

        // 2.axios方式
        // let response = await request({
        //     url: config.baseUrl + '/api/home/index/nav?token=' + config.token,
        // })
        // if (response.code === 200) {
        //     // console.log(response.data.code === 200)
        //     this.setState({
        //         aNav: response.data
        //     })
        // }

    }

    getSwiper() {
        request(config.baseUrl + "/api/home/index/slide?token=" + config.token).then((res) => {
            if (res.code == 200) {
                this.setState({ aSwiper: res.data }, () => {
                    new Swiper("." + Css['swiper-wrap'], {
                        autoplay: 3000,
                        pagination: '.swiper-pagination',
                        autoplayDisableOnInteraction: false
                    })
                });
            }
        })

        // let response = await request({
        //     url: config.baseUrl + "/api/home/index/slide?token=" + config.token
        // })
        // if (response.code === 200) {
        //     // console.log(response.data.code === 200)
        // this.setState({aSwiper:response.data},()=>{
        //     new Swiper("."+Css['swiper-wrap'], {
        //         autoplay: 3000,
        //         pagination : '.swiper-pagination',
        //         autoplayDisableOnInteraction : false
        //     })
        // });
        // }
    }

    getGoods() {
        request(config.baseUrl + "/api/home/index/goodsLevel?token=" + config.token).then(res => {
            // console.log('home-index-res', res.data)
            if (res.code === 200) {
                this.setState({ aGoods: res.data }, () => {
                    lazyImg();
                })
            }
        })
    }

    getReco() {
        request(config.baseUrl + "/api/home/index/recom?token=" + config.token).then(res => {
            if (res.code === 200) {
                this.setState({ aRecoGoods: res.data }, () => {
                    lazyImg();
                })
            }
        })
    }

    pushPage(url, cid) {
        // console.log('index', config.path + url + cid)
        this.props.history.push(config.path + url + cid);
    }

    changeSearchStyle() {
        this.setState({
            pageStyle: { display: 'block' }
        })
    }

    childStyle(val) {
        this.setState({
            pageStyle: val
        })
    }

    // 跳转详情页
    goDetail(url, gid) {
        // console.log('index', gid);
        this.props.history.push(config.path + url);
    }

    // 跳转登录页
    goLogin(url) {
        this.props.history.push(config.path + url);
    }

    componentWillReceiveProps(newProps){
        // console.log('componentWillReceiveProps', newProps);
        this.setState({

        })
    }


    render() {
        // console.log('homeComponent-this.props.state', this.props.state.user);
        return (
            <div className={Css['page']}>
                <SearchComponent stylePage={this.state.pageStyle} childStyle={this.childStyle.bind(this)}></SearchComponent>
                {/* // 1.顶部搜索、登录 */}
                <div className={this.state.bScroll ? Css['top-banner'] + " " + Css['red-bg'] : Css['top-banner']}>
                    <div className={Css['classify-icon']} onClick={this.pushPage.bind(this, "goods/classify/items?cid=", this.state.cid)}></div>
                    <div className={Css['search-wrap']}>
                        <div className={Css['search-icon']}></div>
                        <div className={Css['search-text']} onClick={this.changeSearchStyle.bind(this)}>
                            搜索商品
                        </div>
                    </div>
                    <div className={Css['login-wrap']}>
                        {this.state.isLogin ?
                            <div className={Css['logined']} onClick={this.goLogin.bind(this, 'home/my')}></div>
                        :
                            <div className={[Css['login']]} onClick={this.goLogin.bind(this, 'login/index')}>
                                登录
                            </div>
                        }
                    </div>
                </div>

                {/* // 2.轮播图 */}
                <div className={Css['swiper-wrap']}>
                    <div className="swiper-wrapper">
                        {
                            this.state.aSwiper != null ?
                                this.state.aSwiper.map((item, index) => {
                                    return (
                                        <div key={index} className="swiper-slide"><a href={item.webs} target="_blank" rel="noopener noreferrer"><img src={item.image} alt={item.title} /></a></div>
                                    )
                                }) : ""
                        }
                    </div>
                    <div className="swiper-pagination"></div>
                </div>

                {/* 菜单栏 */}
                <div className={Css['nav-menu']}>
                    {this.state.aNav.map((item) => (
                        <div key={item.cid} className={Css['menu-item']} onClick={this.pushPage.bind(this, "goods/classify/items?cid=", item.cid)}>
                            <div className={Css['item-img']}><img src={item.image}></img></div>
                            <div className={Css['item-text']}>{item.title}</div>
                        </div>
                    ))}
                </div>

                {/* 类目详情 */}
                {
                    this.state.aGoods != null ?
                        this.state.aGoods.map((item, index) => {
                            return (
                                <div key={index} className={Css['goods-level-wrap']}>
                                    <div className={Css['classify-title'] + " " + Css['color' + (index + 1)]}>—— {item.title} ——</div>
                                    {index % 2 === 1 ?
                                        <div className={Css['goods-level1-wrap']}>
                                            {item.items != null ?
                                                item.items.slice(0, 2).map((item2, index2) => {
                                                    return (
                                                        <div key={index2} className={Css['goods-level1-item0']} onClick={this.goDetail.bind(this, 'goods/details/item?gid=' + item2.gid)}>
                                                            <div className={Css['goods-title2']}>{item2.title}</div>
                                                            <div className={Css["goods-text2"]}>火爆开售</div>
                                                            <div className={Css['goods-img2']}>
                                                                <img data-echo={item2.image} src={require("../../../assets/images/common/lazyImg.jpg")} alt={item2.title} />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                : ""}
                                        </div>
                                        : <div className={Css['goods-level1-wrap']}>
                                            <div className={Css['goods-level1-item0']} onClick={this.pushPage.bind(this, 'goods/details/item?gid=' + (item.items[0].gid != null ? item.items[0].gid : ''))}>
                                                <div className={Css['goods-title']}>{item.items != null ? item.items[0].title : ''}</div>
                                                <div className={Css["goods-text"]}>精品打折</div>
                                                <div className={Css['goods-price' + (index + 1)]}>{item.items != null ? item.items[0].price : ''}元</div>
                                                <div className={Css['goods-img']}><img data-echo={item.items != null ? item.items[0].image : ''} src={require("../../../assets/images/common/lazyImg.jpg")} alt={item.items != null ? item.items[0].title : ''} /></div>
                                            </div>
                                            <div className={Css['goods-level1-item1']}>
                                                {
                                                    item.items != null ?
                                                        item.items.slice(1, 3).map((item2, index2) => {
                                                            return (
                                                                <div key={index2} className={Css['goods-row']} onClick={this.goDetail.bind(this, 'goods/details/item?gid=' + item2.gid)}>
                                                                    <div className={Css['goods-row-title']}>{item2.title}</div>
                                                                    <div className={Css['goods-row-text']}>品质精挑</div>
                                                                    <div className={Css['goods-row-img']}><img src={require("../../../assets/images/common/lazyImg.jpg")} data-echo={item2.image} alt={item2.title} /></div>
                                                                </div>
                                                            )
                                                        })
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    }
                                    <div className={Css['goods-list-wrap']}>
                                        {
                                            item.items != null ?
                                                item.items.slice(index % 2 === 1 ? 2 : 3).map((item2, index2) => {
                                                    return (
                                                        <div key={index2} className={Css['goods-list']} onClick={this.goDetail.bind(this, 'goods/details/item?gid=' + item2.gid)}>
                                                            <div className={Css['title']}>{item2.title}</div>
                                                            <div className={Css['image']}><img src={require("../../../assets/images/common/lazyImg.jpg")} data-echo={item2.image} alt={item2.title} /></div>
                                                            <div className={Css['price']}>¥{item2.price}</div>
                                                            <div className={Css['unprice']}>¥{item2.price * 2}</div>
                                                        </div>
                                                    )
                                                })
                                                : ''
                                        }
                                    </div>
                                </div>
                            )
                        })
                        : ""
                }

                {/* 为您推荐 */}
                <div className={Css['reco-title-wrap']}>
                    <div className={Css["line"]}></div>
                    <div className={Css['reco-text-wrap']}>
                        <div className={Css['reco-icon']}></div>
                        <div className={Css['reco-text']}>为您推荐</div>
                    </div>
                    <div className={Css["line"]}></div>
                </div>
                <div className={Css['reco-item-wrap']}>
                    {
                        this.state.aRecoGoods != null ?
                            this.state.aRecoGoods.map((item, index) => {
                                return (
                                    <div key={index} className={Css['reco-item']} onClick={this.goDetail.bind(this, 'goods/details/item?gid=' + item.gid)}>
                                        <div className={Css['image']}><img src={require("../../../assets/images/common/lazyImg.jpg")} alt={item.title} data-echo={item.image} /></div>
                                        <div className={Css['title']}>{item.title}</div>
                                        <div className={Css['price']}>¥{item.price}</div>
                                    </div>
                                )
                            })
                            : ''
                    }
                </div>


            </div>

        );
    }
}

export default connect((state) => {
    return {
        state
    }
})(IndexComponent)