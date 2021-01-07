import React from 'react';
import {request} from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import Css from '../../../assets/css/home/goods/item.css'
// import {lazyImg, localParam} from '../../../assets/js/utils/util';
export default class  GoodsItems extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            aGoods: []
        }
    }

    componentWillReceiveProps(newProps){
        this.getGoodsData(newProps);
    }

    componentDidMount(){
        this.getGoodsData(this.props);
    }

    getGoodsData(props){
        request(config.baseUrl + config.path + 'api/home/category/show' + props.location.search + '&token=' + config.token).then((res) => {
            if (res.code === 200) {
                this.setState({
                    aGoods: res.data
                })
            }else{
                this.setState({
                    aGoods: []
                })
            }
        })
    }

    // 跳转详情页
    goDetail(url){
        this.props.history.push(config.path + url);
    }

    render(){
        return(
            <div>
                {
                    this.state.aGoods.length > 0 ?
                        <div>
                            {this.state.aGoods.map((item, index) => (
                                <div className={Css['goods-wrap']} key={index}>
                                    <div className={Css['item-title']}>{item.title}</div>
                                    <div className={Css['item-wrap']}>
                                        {
                                            item.goods ?
                                                item.goods.map((item1, index1) => (
                                                    <div className={Css['goods-item']} key={index1} onClick={this.goDetail.bind(this, 'goods/details/item?gid=' + item1.gid)}>
                                                        <div className={Css['image']}><img src={item1.image} alt={item1.title}></img></div>
                                                        <div className={Css['title']}>{item1.title}</div>
                                                    </div>
                                                ))
                                            : ''
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    :<div>没有相关商品</div>
                    
                }
            </div>
        );
    }
}