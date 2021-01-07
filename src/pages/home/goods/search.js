import React from 'react';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import Css from '../../../assets/css/home/goods/search.css';
import SearchComponent from '../../../components/search/search';
import IScroll from '../../../assets/js/libs/iscroll.js';
import { lazyImg } from '../../../assets/js/utils/util.js'; //图片懒加载
import UpRefresh from '../../../assets/js/libs/uprefresh.js';  //下拉刷新
// import {localParam} from '../../../assets/js/utils/util';
// import {lazyImg, localParam} from '../../../assets/js/utils/util';
export default class SearchItems extends React.Component {
    constructor(props) {
        super(props);
        // state里的异步变量
        this.state = {
            bMask: false, //灰色透明蒙版
            screenMove: '',  //弹出筛选栏
            orderShow: false, //排序筛选的隐藏和显示
            selectSales: false, //是否选中销量
            selectCombine: true,   // 默认选中综合
            pageStyle: { display: 'none' }, //是否显示搜索组件
            isLocal: 1, // 代表从搜索页面跳转到搜索组件
            searchKeywords: '',     //搜索关键字
            aGoods: [], // 产品搜索结果
            aClassify: [], //选择商品分类
            itemTotal: 0, //搜索结果的总数
            classifyIcon: true,  // 分类详情-下拉-收起
            aPriceOrder: [
                {title: '综合', type: 'all', checked: true},
                {title: '价格从低到高', type: 'up', checked: false},
                {title: '价格从高到低', type: 'down', checked: false}
            ],
            aPrice: {
                checked: true,
                item: [
                    {price1:1,price2:50,checked:false},
                    {price1:51,price2:99,checked:false},
                    {price1:100,price2:300,checked:false},
                    {price1:301,price2:1000,checked:false},
                    {price1:1001,price2:4000,checked:false},
                    {price1:4001,price2:9999,checked:false}
                ]
            },
            lowPrice: '',    // 最低价格
            highPrice: ''  // 最高价格
        }
        // 同步变量
        this.myScroll = null; // 滚动条
        this.maxPage = 0;     // 总页数
        this.oUpRefresh = null;  // 下拉刷新
        this.curPage = 1;     // 当前页
        this.offsetBottom = 100;  // 提前加载100个像素
        this.orderShow = true;     // 排序筛选的隐藏和显示
        this.selectSales = false; //是否选中销量
        this.selectCombine = true;   // 默认选中综合
        this.oType = 'all';     //all:综合，up:从低到高，down:从高到底，sales:销量
        this.sParam = '';
        this.sParams = '';      // 请求地址的参数
        this.searchKeywords = '';     //搜索关键字
        this.lowPrice = '';      // 最低价格
        this.highPrice = '';  // 最高价格
        this.cid = '';      // 分类id

    }

    componentDidMount() {
        // 在筛选页面加滚动条
        this.myScroll = new IScroll('#screen', {
            scrollX: false,
            scrollY: true,
            preventDefault: false
        });
        this.setState({
            searchKeywords: decodeURIComponent(this.props.location.search.split('=')[1])
        })
        this.searchKeywords = decodeURIComponent(this.props.location.search.split('=')[1]);
        this.getClassify();
        this.getPageData();
    }

    // 搜索选择页面的数据
    getClassify() {
        let url = config.baseUrl + "/api/home/category/menu?token=" + config.token;
        request(url).then((res) => {
            res.data.forEach(item => {
                item['checked'] = false;
            });
            // console.log('aClassify', res.data);            
            this.setState({
                aClassify: res.data
            }, () => {
                this.myScroll.refresh()
            })
        })
    }

    // 点击选中分类
    checkedClassify(index){
        let classifyTemp = this.state.aClassify;
        classifyTemp.forEach((item, index1) => {
            if(index === index1){
                item['checked'] = true;
                this.cid = item['cid'];
            }else{
                item['checked'] = false;
            }
        })
        // console.log('aClassify, this.cid', this.state.aClassify, this.cid);
        this.setState({aClassify: classifyTemp})
    }

    // 封装请求地址的参数
    setParams() {
        this.sParams = 'kwords=' + this.searchKeywords + '&param=' + this.sParam + '&price1='+ this.lowPrice + '&price2='+ this.highPrice + '&otype=' + this.oType + '&cid=' + this.cid
    }

    // 加载搜索结果
    getPageData() {
        this.setParams();
        let url = config.baseUrl + '/api/home/goods/search?' + this.sParams + '&page=1&token=' + config.token; 
        request(url).then((res) => {
            if(res.code === 200){
                // console.log('search-url-res', url, res);
                this.setState({
                    aGoods: res.data,
                    itemTotal: res.pageinfo.total
                }, () => {
                    lazyImg()
                });
                this.maxPage = res.pageinfo.pagenum;
                this.getScrollPage();
            }else{
                this.setState({aGoods: [], itemTotal: 0})
            }
        })
    }

    // 加载多页搜索结果
    // 传入参数：当前页、最大页、提前加载像素
    // 执行request, 再次请求，请求下一页的内容
    // 将下一页的结果push到aGoods里
    getScrollPage() {
        this.setParams()
        // this.curPage++;
        this.oUpRefresh = new UpRefresh({ 'curPage': this.curPage, 'maxPage': this.maxPage, 'offsetBottom': this.offsetBottom }, curPage => {
            let url = config.baseUrl + '/api/home/goods/search?' + this.sParams + '&page=' + curPage + '&token=' + config.token;;
            request(url).then((res) => {
                // console.log('search-getScrollPage-this.curPage-url-res', this.curPage, url, res);
                if (res.code === 200) {
                    // 将当前页的内容和新加载页的内容合并
                    let aGoodsTemp = this.state.aGoods;
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data.length > 0) {
                            aGoodsTemp.push(res.data[i])
                        }
                    }
                    this.setState({
                        aGoods: aGoodsTemp
                    }, () => {
                        lazyImg();
                    })
                }
            })
        })
    }

    // 显示蒙版和筛选
    showScreen() {
        // console.log('this.refs',this.refs);
        // this.refs['mask'].addEventListener("touchmove", function(e){
        //     e.preventDefault();
        // }, false);
        // this.refs['screen'].addEventListener("touchmove", function(e){
        //     e.preventDefault();
        // }, false)
        this.setState({
            bMask: true,
            screenMove: Css['move']
        })
    }

    // 隐藏蒙版和筛选
    hideScreen() {
        this.setState({
            bMask: false,
            screenMove: Css['unmove']
        })
    }

    goBack() {
        // console.log(this.props);
        this.props.history.goBack()
    }

    // 排序下拉显示
    changeOrderShow() {
        this.selectSales = false;
        this.setState({ selectSales: false })
        if (!this.orderShow) {
            this.orderShow = true;
            this.setState({
                orderShow: true,
            })
        } else {
            this.orderShow = false;
            this.setState({ orderShow: false })
        }
    }

    // 选中销量
    changeSelectSales() {
        this.orderShow = false;
        this.selectCombine = false;
        this.setState({ orderShow: false });
        if (!this.selectSales) {
            // this.selectSales = true;
            this.setState({
                selectSales: true,
            })
        } else {
            this.selectSales = false;
        }
        this.oType = 'sales';
        this.getPageData();
    }

    // 改变下拉排序选项
    changeOtypeChecked(oType){
        this.oType = oType;
        this.getPageData();
        let aPriceOrderTemp = this.state.aPriceOrder;
        for(let i = 0; i < aPriceOrderTemp.length; i++){
            let item = aPriceOrderTemp[i];
            if(item['type'] === oType){
                item['checked'] = true;
            }else{
                item['checked'] = false;
            }
        }
        this.orderShow = false;
        this.setState({orderShow: false});
        this.selectCombine = true;
        this.setState({aPriceOrder: aPriceOrderTemp})
    }

    // 子传父：搜索组件关闭时
    childStyle(val) {
        this.setState({
            pageStyle: val
        })
    }

    // 显示搜索子组件
    changeSearchStyle() {
        this.setState({
            pageStyle: { display: 'block' }
        })
    }

    // 搜索页面的搜索组件 跳到 搜索页面
    getChildKeywords(val) {
        this.setState({
            pageStyle: { display: 'block' }
        })
    }

    // 确定搜索
    goSearch(){
        this.hideScreen();
        this.getPageData();
    }

    // 搜索类目的下拉-收起
    changeClassifyUpDown(){
        let classifyIconTemp = !this.state.classifyIcon;
        this.setState({classifyIcon: classifyIconTemp});
    }

    // 价格区间下拉-收起
    changePriceUpDown(){
        let aPriceTemp = this.state.aPrice;
        aPriceTemp.checked = !aPriceTemp.checked
        this.setState({aPrice: aPriceTemp});
    }

    // 选中价格区间
    checkedPrice(index){
        // 调整背景颜色
        let aPriceTemp = this.state.aPrice;
        aPriceTemp.item.forEach((item, index1) => {
            if(index === index1){
                item['checked'] = true;
            }else{
                item['checked'] = false;
            }
        })
        let lowPriceTemp = this.state.aPrice.item[index].price1;
        let highPriceTemp = this.state.aPrice.item[index].price2;
        // 填充价格范围
        this.setState({
            aPrice: aPriceTemp,
            lowPrice: lowPriceTemp,
            highPrice: highPriceTemp
        }, () => {
            this.lowPrice = lowPriceTemp;
            this.highPrice = highPriceTemp
        }); 
    }

    // 监听最低价格的变化
    changePrice1(e){
        // console.log(e.target.value)
        let newPrice = e.target.value;
        this.setState({lowPrice: newPrice}, () => {
            this.lowPrice = newPrice;
        })

    }

    // 监听最高价格的变化
    changePrice2(e){
        let newPrice = e.target.value;
        this.setState({highPrice: newPrice}, () => {
            this.highPrice = newPrice;
        })
    }

    // 跳转详情页
    goDetail(url){
        // console.log('search-goDetail', url)
        this.props.history.push(config.path + url);
    }


    render() {
        // console.log('aGoods', this.state.aGoods)
        return (
            <div>
                {/* childStyle： 接收子传过来的值   stylePage：父传给子的值*/}
                <SearchComponent stylePage={this.state.pageStyle} childStyle={this.childStyle.bind(this)} isLocal={this.state.isLocal} childKeywords={this.getChildKeywords.bind(this)}></SearchComponent>
                <div className={Css['top-wrap']}>
                    <div className={Css['back-icon']} onClick={this.goBack.bind(this)}></div>
                    <div className={Css['search-wrap']}>
                        <div className={Css['search-icon']}></div>
                        <input className={Css['search-content']} placeholder={this.state.searchKeywords} onClick={this.changeSearchStyle.bind(this)}></input>
                    </div>
                    <div className={Css['select']} onClick={this.showScreen.bind(this)}>筛选</div>
                </div>

                <div className={Css['control-wrap']}>
                    <div className={this.state.orderShow ? Css['combine-wrap'] + " " + Css['up'] : Css['combine-wrap']} >
                        <div className={this.selectCombine ? Css['combine'] + " " + Css['color'] : Css['combine']} onClick={this.changeOtypeChecked.bind(this, 'all')}>综合</div>
                        <div className={Css['show']} onClick={this.changeOrderShow.bind(this)}></div>
                    </div>
                    <div className={this.state.selectSales ? Css['sale-count'] + " " + Css['color'] : Css['sale-count']} onClick={this.changeSelectSales.bind(this)}>销量</div>
                    <div className={this.state.orderShow ? Css['order-wrap'] : Css['order-wrap'] + ' hide'}>
                        {
                            this.state.aPriceOrder.map((item, index) => (
                                <div key={index} className={item.checked ? Css['item'] + ' ' +Css['color'] : Css['item']} onClick={this.changeOtypeChecked.bind(this, item.type)}>{item.title}</div>
                            ))
                        }
                    </div>
                </div>


                <div className={Css['goods-wrap']}>
                    {this.state.aGoods.length > 0 ?
                        this.state.aGoods.map((item, index) => (
                            <div className={Css['item-wrap']} key={index} onClick={this.goDetail.bind(this, 'goods/details/item?gid=' + item.gid)}>
                                <div className={Css['item-img']}><img data-echo={item.image} src={require('../../../assets/images/common/lazyImg.jpg')} alt={item.title}></img></div>
                                <div className={Css['item-content-wrap']}>
                                    <div className={Css['title']}>{item.title}</div>
                                    <div className={Css['price']}>￥{item.price}</div>
                                    <div className={Css['sales-count']}>销量{item.sales}件</div>
                                </div>
                            </div>
                        ))
                        : <div>没有相关商品</div>}
                </div>

                <div ref="mask" className={this.state.bMask ? Css['mask'] : Css['mask'] + 'hide'} onClick={this.hideScreen.bind(this)}></div>
                <div ref="screen" id="screen" className={Css['screen'] + " " + this.state.screenMove}>
                    <div className={Css['content-wrap']}>
                        <div className={Css['classify-wrap']}>
                            <div className={Css['title-wrap']}>
                                <div className={Css['title']}>分类</div>
                                <div className={this.state.classifyIcon ? Css['icon'] : Css['icon'] + ' ' + Css['up']} onClick={this.changeClassifyUpDown.bind(this)}></div>
                            </div>
                            {
                                this.state.classifyIcon?
                                    <div className={Css['items-wrap']}>
                                        {this.state.aClassify.map((item, index) => (
                                            <div className={item.checked ? Css['item'] + ' ' + Css['checked']: Css['item']} key={index} onClick={this.checkedClassify.bind(this, index)}>{item.title}</div>
                                        ))}
                                    </div>
                                :''
                            }
                            
                        </div>
                        <div className={Css['price-wrap']}>
                            <div className={Css['title-wrap']}>
                                <div className={Css['title']}>价格区间</div>
                                <div className={Css['range-wrap']}>
                                    <div className={Css['price']} id='price1'>
                                        <input placeholder='最低价' value={this.state.lowPrice > 0 ? this.state.lowPrice : ''} onChange={this.changePrice1.bind(this)}></input>
                                    </div>
                                    <div className={Css['price-line']}>——</div>
                                    <div className={Css['price']} id='price2'>
                                        <input placeholder='最高价' value={this.state.highPrice ? this.state.highPrice : ''} onChange={this.changePrice2.bind(this)}></input>
                                    </div>
                                    <div className={this.state.aPrice.checked ? Css['icon'] : Css['icon'] + ' ' + Css['up']} onClick={this.changePriceUpDown.bind(this)}></div>
                                </div>
                                </div>
                            {
                                this.state.aPrice.checked ? 
                                    <div className={Css['items-wrap']}>
                                        {this.state.aPrice.item.length > 0 ?
                                            this.state.aPrice.item.map((item, index) => (
                                                <div className={item.checked ? Css['item'] + ' ' + Css['checked'] : Css['item'] } key={index} onClick={this.checkedPrice.bind(this, index)}>{item.price1}-{item.price2}</div>
                                            ))
                                        : ''
                                        }
                                    </div>
                                : ''
                            }
                            
                        </div>
                        <div className={Css['classify-wrap']}>
                            <div className={Css['title-wrap']}>
                                <div className={Css['title']}>品牌</div>
                                <div className={Css['icon']}></div>
                            </div>
                            <div className={Css['items-wrap']}>
                                <div className={Css['item']}>潮装女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                            </div>
                        </div>
                        <div className={Css['classify-wrap']}>
                            <div className={Css['title-wrap']}>
                                <div className={Css['title']}>分类</div>
                                <div className={Css['icon']}></div>
                            </div>
                            <div className={Css['items-wrap']}>
                                <div className={Css['item']}>潮装女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                            </div>
                        </div>
                        <div className={Css['classify-wrap']}>
                            <div className={Css['title-wrap']}>
                                <div className={Css['title']}>分类</div>
                                <div className={Css['icon']}></div>
                            </div>
                            <div className={Css['items-wrap']}>
                                <div className={Css['item']}>潮装女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                            </div>
                        </div>
                        <div className={Css['classify-wrap']}>
                            <div className={Css['title-wrap']}>
                                <div className={Css['title']}>品牌</div>
                                <div className={Css['icon']}></div>
                            </div>
                            <div className={Css['items-wrap']}>
                                <div className={Css['item']}>潮装女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                                <div className={Css['item']}>潮流女装</div>
                            </div>
                        </div>
                    </div>
                    <div className={Css['bottom-wrap']}>
                        <div className={Css['item']} id="count">共16件</div>
                        <div className={Css['item']} id="reset">全部重置</div>
                        <div className={Css['item']} id="sure" onClick={this.goSearch.bind(this)}>确定</div>
                    </div>
                </div>
            </div>
        );
    }
}