/*eslint-disable*/
import React from 'react';
import Css from '../../../assets/css/home/home/index.css';
import { Route, Switch } from 'react-router-dom';
import asyncComponents from '../../../components/async/AsyncComponent';
import config from '../../../assets/js/conf/config.js';
import { connect } from 'react-redux';
const CartComponent = asyncComponents(() => import('../cart/index'));
const IndexComponent = asyncComponents(() => import('../index/index'));
const UserComponent = asyncComponents(() => import('../../user/index/index'));
class HomeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bHomeStyle: true,
            bCartStyle: true,
            bMyStyle: true
        }
    }
    componentWillMount(){
        this.handleNavStyle(this.props);
    }
    componentDidMount() {

    }
    // 属性props改变
    componentWillReceiveProps(newProps) {
        // newProps是改变后的props
        this.handleNavStyle(newProps)
    }
    goPage(url) {
        this.props.history.replace(config.path + url);
    }

    pushPage(url) {
        this.props.history.push(config.path + url);
    }
    handleNavStyle(props){
        switch (props.location.pathname){
            case config.path+"home/index":
                this.setState({
                    bHomeStyle: true,
                    bCartStyle: false,
                    bMyStyle: false
                });
                break;
            case config.path+"home/cart":
                this.setState({
                    bHomeStyle: false,
                    bCartStyle: true,
                    bMyStyle: false
                }) 
                break;
            case config.path+"home/my":
                this.setState({
                    bHomeStyle: false,
                    bCartStyle: false,
                    bMyStyle: true
                })
                break;
            default:
                break;
        }

    }
    render() {
        // console.log('homeComponent-this.props.state', this.props.state.user);
        return (
            <div>
                <React.Fragment>
                    <Switch>
                        <Route path={config.path + 'home/index'} component={IndexComponent}></Route>
                        <Route path={config.path + 'home/cart'} component={CartComponent}></Route>
                        <Route path={config.path + 'home/my'} component={UserComponent}></Route>
                    </Switch>
                </React.Fragment>
                <div className={Css['buttom-nav']}>
                    <ul onClick={this.goPage.bind(this, 'home/index')}>
                        <li className={this.state.bHomeStyle? Css['home'] + " " + Css['active'] : Css['home']}></li>
                        <li className={this.state.bHomeStyle? Css['text'] + " " + Css['active'] : Css['text']}>首页</li>
                    </ul>
                    <ul onClick={this.goPage.bind(this, 'home/cart')}>
                        <li className={this.state.bCartStyle? Css['cart'] + " " + Css['active'] : Css['cart']}></li>
                        <li className={this.state.bCartStyle? Css['text'] + " " + Css['active'] : Css['text']}>购物车</li>
                    </ul>
                    {this.props.state.user.isLogin ?
                        <ul onClick={this.goPage.bind(this, 'home/my')}>
                            <li className={this.state.bMyStyle? Css['my'] + " " + Css['active'] : Css['my']}></li>
                            <li className={this.state.bMyStyle? Css['text'] + " " + Css['active'] : Css['text']}>我的</li>
                        </ul>
                    : 
                        <ul onClick={this.pushPage.bind(this, 'login/index')}>
                            <li className={this.state.bMyStyle? Css['my'] + " " + Css['active'] : Css['my']}></li>
                            <li className={this.state.bMyStyle? Css['text'] + " " + Css['active'] : Css['text']}>我的</li>
                        </ul>
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
})(HomeComponent)