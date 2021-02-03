/*eslint-disable*/
import React from 'react';
import Css from '../../../assets/css/cart/index.css';
import { connect } from 'react-redux';
import action from '../../../actions';
import HeadComponent from '../../../components/head/head';
import config from '../../../assets/js/conf/config';
class CartIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 1,
            bAllChecked: false,
            isLogin: false,
            cartData: this.props.state.cart.total
        }
    }
    componentDidMount() {
        this.isAllChecked();
    }



    // 判断是否全选
    isAllChecked() {
        // 记录选中的个数
        let selectCount = 0;
        for (let key in this.props.state.cart.aCartData) {
            if (!this.props.state.cart.aCartData[key].checked) {
                break;
            }
            selectCount++;
        }
        // 如果全部勾选：一个个勾选
        if (selectCount === this.props.state.cart.aCartData.length) {
            this.setState({ bAllChecked: true });
            return true;
        } else {
            this.setState({ bAllChecked: false })
            return false;
        }
    }

    // 返回
    goBack() {
        // console.log(this.props)
        this.props.history.goBack()
    }

    // 跳转结算页
    pushPage(sUrl) {
        this.props.history.push(config.path + sUrl);
    }

    // 数量减少
    moveCount(index) {
        this.props.dispatch(action.cart.decAmount({ index: index }))
    }

    // 数量加1
    addCount(index) {
        this.props.dispatch(action.cart.incAmount({ index: index }))
    }

    // 删除商品
    delItem(index) {
        if (this.props.state.cart.aCartData.length > 0) {
            this.props.dispatch(action.cart.delItem({ index: index }))
        }
    }

    // 修改选中
    checkItem(index) {
        this.props.dispatch(action.cart.checkItem({ index: index }));
        let checked = this.isAllChecked();
    }

    // 全选
    isSetAllChecked(checked) {
        this.setState({ bAllChecked: checked })
        this.props.dispatch(action.cart.setAllChecked({ checked: checked }))
    }





    render() {
        console.log('cart-index', this.props.state)
        return (
            <div className={Css['page']}>

                <HeadComponent title="购物车 "></HeadComponent>
                {this.state.cartData ?
                    <div className={Css['goods-wrap']}>
                        {this.props.state.cart.aCartData.length > 0 ?
                            this.props.state.cart.aCartData.map((item, index) => (
                                <div className={Css['item-wrap']} key={index}>
                                    {/* 左 */}
                                    <div className={item.checked ? Css['select-icon'] + ' ' + Css['checked'] : Css['select-icon']} onClick={this.checkItem.bind(this, index)}></div>
                                    {/* 中 */}
                                    <div className={Css['img-wrap']}>
                                        <div className={Css['img']}><img src={item.img} alt={item.title}></img></div>
                                        <div className={Css['title']} onClick={this.delItem.bind(this, index)}>删除</div>
                                    </div>
                                    {/* 右 */}
                                    <div className={Css['content-wrap']}>
                                        <div className={Css['title']}>
                                            {item.title}
                                        </div>

                                        {/* 商品属性 */}
                                        {item.attrs.length > 0 ?
                                            <div className={Css['type-wrap']}>
                                                {item.attrs.map((item1, index1) => (
                                                    <div className={Css['type']} key={index1}>
                                                        <div className={Css['item']}>{item1.title}: </div>
                                                        <div className={Css['item']}>
                                                            {item1.values.map((item2, index2) => {
                                                                if (item2.active) {
                                                                    return <div key={index2}>{item2.value}</div>
                                                                }
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            : ''
                                        }

                                        {/* 数量控制 */}
                                        <div className={Css['price-count']}>
                                            <div className={Css['price']}>￥{item.price}</div>
                                            <div className={Css['count']}>
                                                <div className={Css['action']} onClick={this.moveCount.bind(this, index)}>-</div>
                                                <div className={Css['num']}>{item.amount}</div>
                                                <div className={Css['action']} onClick={this.addCount.bind(this, index)}>+</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))
                            : ''
                        }
                    </div>
                    : <div className={Css['error-message']}>购物车是空的，赶紧去加购哦~</div>
                }
                
                <div className={Css['bottom-wrap']}>
                    <div className={Css['selectAll-wrap']}>
                        <div className={this.state.bAllChecked ? Css['icon'] + ' ' + Css['checked'] : Css['icon']} onClick={this.isSetAllChecked.bind(this, !this.state.bAllChecked)}></div>
                        <div className={Css['title']}>全选</div>
                    </div>

                    <div className={Css['countAll-wrap']}>
                        <div className={Css['count-all']}>合计：{this.props.state.cart.total}</div>
                        <div className={Css['submit']} onClick={this.pushPage.bind(this, 'order/index')}>去结算</div>
                    </div>
                </div>

            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(CartIndex)