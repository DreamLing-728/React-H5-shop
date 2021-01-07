/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
import actions from '../../../actions';
import HeadComponent from '../../../components/head/head';
import TagsComponent from '../../../components/tags/tags'
import Css from '../../../assets/css/user/myorder/index.css';
import { Switch, Route} from 'react-router-dom';
import asyncComponent from '../../../components/async/AsyncComponent';
const OrderPage=asyncComponent(() => import('./order'));
const ReviewPage=asyncComponent(() => import('./review'));
class  MyOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            status: this.props.location.search.split('=')[1],
            title: '',
        }
    }

    componentDidMount(){
        this.getTitle();
    }

    componentWillReceiveProps(newProps) {
        // console.log('myorder-index-newProps', newProps.location.search.split('=')[1]);
        this.setState({
            status: newProps.location.search.split('=')[1],
        }, () => {
            this.getTitle()
        })
    }

    getTitle() {
        switch (this.state.status){
            case 'all':
                this.setState({ title: '全部订单' })
                break;
            case '0':
                this.setState({ title: '待付款' })
                break;
            case '1':
                this.setState({ title: '待收货' })
                break;
            case '2':
                this.setState({ title: '待评价' })
                break;
            default:
                this.setState({ title: '全部订单' })
        }
    }

    render(){
        // console.log('myorder-index, status, title', this.state.status, this.state.title)
        return(
            <div className={['page']}>
                <HeadComponent title={this.state.title}></HeadComponent>
                <TagsComponent></TagsComponent>
                <div>
                    <Switch>
                        <Route path={config.path + 'myorder/order'} component={OrderPage}></Route>
                        <Route path={config.path + 'myorder/review'} component={ReviewPage}></Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return{
        state
    }
})(MyOrder)