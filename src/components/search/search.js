import React from 'react';
import Css from './search.css';
import { request } from '../../assets/js/libs/request';
import config from '../../assets/js/conf/config'
import { Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../../actions/index';
// 子组件无法路由，需导入这个
import {withRouter} from 'react-router'
class SearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bHistory: false,
            aHotKeywords: [],
            searchKeywords: ''
        }
        this.historyKeywords = props.state.hk.keywords;   
    }
    componentDidMount() {
        this.getHotKeywords();
        this.getHistoryKeywords();
    }

    getHistoryKeywords(){
        if(this.historyKeywords.length > 0){
            this.setState({bHistory: true})
        }
    }

    getHotKeywords() {
        // console.log(localStorage);
        request(config.baseUrl + config.path + 'api/home/public/hotwords?token=' + config.token).then((res) => {
            if (res.code === 200) {
                this.setState({
                    aHotKeywords: res.data,
                })
            }
        })
    }


    clearHistory() {
        Modal.alert('', '确认删除?', [
            { text: '取消', onPress: () => { }, style: 'default' },
            {
                text: '确定', onPress: () => {
                    localStorage.removeItem("hk");
                    this.props.dispatch(action.hk.addHistoryKeywords({keywords:[]}));
                    this.historyKeywords=[];
                    this.setState({bHistory: false})
                }
            },
        ]);
    }
    addHistoryKeywords() {
        if(this.state.searchKeywords === ''){
            return false;
        }
        console.log('search-component-1, localStorage["hk"]', localStorage['hk']);
        this.historyKeywords.unshift(this.state.searchKeywords);
        // 把搜索数组去重
        let uniArray = new Set(this.historyKeywords);
        this.historyKeywords = [...uniArray];
        // 更新localStorage
        localStorage['hk'] = JSON.stringify(this.historyKeywords);
        // 操作action
        this.props.dispatch(action.hk.addHistoryKeywords({keywords: this.state.searchKeywords}))
        this.getHistoryKeywords();
        this.goPage('goods/search?keywords=' + this.state.searchKeywords);
        console.log('search-component-2, localStorage["hk"]', localStorage['hk']);
    }

    goPage(url){
        // console.log('component-search-this.props', this.props);
        this.props.history.push(config.path+url);
        if (this.props.isLocal==='1'){
            this.props.history.replace(config.path+url);
        } else{
            this.props.history.push(config.path+url);
        }
    }

    render() {
        // console.log('this.props', this.props);
        return (
            <div style={this.props.stylePage} className={Css['page']}>
                <div className={Css['search-header']}>
                    <div className={Css['close']} onClick={this.props.childStyle.bind(this, { display: 'none' })}></div>
                    <div className={Css['search-wrap']}>
                        <div className={Css['search-input']}>
                            <input type="text" placeholder="输入搜索" onChange={(e) => { this.setState({ searchKeywords: e.target.value }) }}></input>
                        </div>
                        <div className={Css['search-icon']} onClick={this.addHistoryKeywords.bind(this)}></div>
                    </div>
                </div>
                <div className={this.state.bHistory ? Css['search-main'] : Css['search-main'] + " hide"}>
                    <div className={Css['search-title-wrap']}>
                        <div className={Css['search-title']}>最近搜索</div>
                        <div className={Css['search-delete']} onClick={this.clearHistory.bind(this)}></div>
                    </div>
                    <div className={Css['search-content-wrap']}>
                        {
                            this.historyKeywords.length !== null ?
                                this.historyKeywords.map((item, index) => (
                                    <div className={Css['search-content']} key={index} onClick={this.goPage.bind(this, "goods/search?keyWords="+item)}>
                                        {item}
                                    </div>
                                ))
                            : <div>搜索记录为空</div>
                        }
                    </div>
                </div>

                <div className={Css['search-main']}>
                    <div className={Css['search-title-wrap']}>
                        <div className={Css['search-title']}>最近搜索</div>
                    </div>
                    <div className={Css['search-content-wrap']}>
                        {
                            this.state.aHotKeywords.length > 0 ?
                                this.state.aHotKeywords.map((item, index) => (
                                    <div className={Css['search-content']} key={index} onClick={this.goPage.bind(this, "goods/search?keyWords="+item.title)}>
                                        {item.title}
                                    </div>
                                ))
                                : <div>无热门搜索</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state)=>{
    return{
        state:state
    }
})(withRouter(SearchComponent))