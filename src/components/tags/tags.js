/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import config from '../../assets/js/conf/config';
import Css from './tags.css';
class  TagsComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.location.search.split('=')[1],
            titleList: [
                {title: '全部订单', active: true},
                {title: '待付款', active: false},
                {title: '待收货', active: false},
                {title: '待评价', active: false},
            ]
        }
    }

    // 跳转页面
    replacePage(url, index) {
        let titleListTemp = this.state.titleList;
        for(let i = 0; i < titleListTemp.length; i++){
            titleListTemp[i].active = false;
            if(i === index) {
                titleListTemp[i].active = true;
            }
        }
        if(index === 0){
            index = 'all';
            this.props.history.replace(config.path + url + index);
        } else {
            index = index - 1;
            this.props.history.replace(config.path + url + index);
        }
    }

    render(){
        // console.log('component-tags', this.state.status)
        return(
            <div className={['page']}>
                <div className={Css['nav-wrap']}>
                    {this.state.titleList.length > 0 ?
                        this.state.titleList.map((item, index) => (
                            <div key={index} className={item.active ? Css['item'] + ' ' + Css['active'] : Css['item']} onClick={this.replacePage.bind(this, 'myorder/order?status=', index)}>{item.title}</div>
                        ))
                    :
                        <div>无导航标题</div>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(TagsComponent);