import React from 'react';
import Css from '../../../assets/css/home/goods/classify.css';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import { Route, Switch } from 'react-router-dom';
import GoodsItems from './items';
import SearchComponent from '../../../components/search/search'
export default class GoodsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aclassify: [],
            pageStyle: { display: 'none' },
            cid: ''
        }
    }

    componentDidMount() {
        // console.log('classify', decodeURIComponent(this.props.location.search.split('=')[1]))
        this.setState({
            cid: decodeURIComponent(this.props.location.search.split('=')[1])
        })
        this.getClassify();
        // this.selectClassify();
    }


    backPage() {
        // console.log(this.props)
        this.props.history.goBack();
    }

    replacePage(pUrl) {
        this.props.history.replace(config.path + pUrl);
    }

    childStyle(val) {
        this.setState({
            pageStyle: val
        })
    }

    changeSearchStyle() {
        this.setState({
            pageStyle: { display: 'block' }
        })
    }

    getClassify() {
        request(config.baseUrl + config.path + 'api/home/category/menu?token=' + config.token).then((res) => {
            if (res.code === 200) {
                // 新增bActive：false，代表未点击不高亮
                res.data.map((item) => (
                    item['bActive'] = false
                ))
                this.setState({
                    aclassify: res.data
                })
            }
        })
        // this.selectClassify();
    }

    selectClassify(pUrl, cid) {
        // 全部不高亮
        for (let i = 0; i < this.state.aclassify.length; i++) {
            let item = this.state.aclassify[i];
            if (item.bActive === true) {
                item.bActive = false;
            }
            if (item.cid === cid){
                item.bActive = true;

            }
        }
        let resTemp = this.state.aclassify;
        
        // 重新渲染
        this.setState({
            aclassify: resTemp,
            cid: cid
        })
        let url = pUrl + cid;
        this.replacePage(url);
    }

    

    render() {
        // console.log('classify', this.props)
        return (
            <div>
                <div className={Css['search-header']}>
                    <div className={Css['back-icon']} onClick={this.backPage.bind(this)}>
                    </div>
                    <div className={Css['search']} >
                        <input placeholder="搜索商品" onClick={this.changeSearchStyle.bind(this)}></input>
                    </div>
                </div>

                <div className={Css['goods-main']}>
                    {/* 左边分类 */}
                    <div id="scroll-classify" className={Css['classify-wrap']}>
                        {this.state.aclassify.map((item, index) => (
                            <div key={index} className={item.bActive ? Css['classify-item'] + " " + Css["active"] : Css['classify-item']} onClick={this.selectClassify.bind(this, 'goods/classify/items?cid=', item.cid, index)}>
                                {item.title}
                            </div>
                        ))}
                    </div>
                    {/* 右边详情 */}
                    <div className={Css['goods-content']}>
                        <Switch>
                            <Route path={config.path + "goods/classify/items"} component={GoodsItems}></Route>
                        </Switch>
                    </div>
                </div>

                <SearchComponent stylePage={this.state.pageStyle} childStyle={this.childStyle.bind(this)}></SearchComponent>

            </div>
        );
    }
}