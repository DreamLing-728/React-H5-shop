import React from 'react';
import { connect } from 'react-redux';
import HeadComponent from '../../../components/head/head';
import Css from '../../../assets/css/user/mark/index.css';
import config from '../../../assets/js/conf/config';
import { request } from '../../../assets/js/libs/request';
// import { Toast } from 'antd-mobile';
import UpRefresh from '../../../assets/js/libs/uprefresh';
import { lazyImg } from '../../../assets/js/utils/util';
class MarkIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            aGoods: []
        }
        this.curPage = 1;   //当前页
        this.maxPage = 0;   //最大页
        this.offsetBottom = 100;  // 提前加载100个像素
        this.oUpRefresh = null;
    }

    componentDidMount() {
        this.getMarkData();
    }

    // 获取数据
    getMarkData() {
        // let url = config.baseUrl + '/api/user/fav/index?uid=' + this.state.uid + '&token=' + config.token + '&page=' + this.curPage;
        // request(url, 'get').then((res) => {
        //     console.log('user-mark-getMarkData', res);
        //     if (res.code === 200) {
        //         this.setState({
        //             markData: res.data
        //         }, () => {
        //             this.curPage = res.pageinfo.page;
        //             this.maxPage = res.pageinfo.pagenum;
        //             lazyImg();
        //             this.getUpRefresh();
        //         })
        //     } else {
        //         Toast.info(res.data)
        //     }
        // })

        let url=config.baseUrl+"/api/user/fav/index?uid="+this.props.state.user.uid+"&token="+config.token+"&page="+this.curPage;
        request(url).then(res=>{
            console.log('user-mark-getMarkData', res);
            if (res.code ===200){
                this.maxPage=res.pageinfo.pagenum;
                this.setState({aGoods:res.data},()=>{
                    lazyImg();
                    this.getScrollPage();
                });
            }
        })
    }

    // 下拉刷新
    getScrollPage() {
        // let opts = {
        //     'curPage': parseInt(this.curPage),
        //     'maxPage': this.maxPage,
        //     'offsetBottom': this.offsetBottom
        // };
        // this.oUpRefresh = new UpRefresh(opts, (curPage) => {
        //     let url = config.baseUrl + '/api/user/fav/index?uid=' + this.state.uid + '&token=' + config.token + '&page=' + curPage;
        //     request(url, 'get').then((res) => {
        //         console.log('user-mark-getUpFeresh-res', res)
        //     })
        // });

        let opts = {"curPage":this.curPage,"maxPage":this.maxPage,"offsetBottom":this.offsetBottom}
        this.oUpRefresh=new UpRefresh(opts, curPage=>{
            let url=config.baseUrl+"/api/user/fav/index?uid="+this.props.state.user.uid+"&token="+config.token+"&page="+curPage;
            request(url).then((res)=>{
                console.log('user-mark-getUpFeresh-res', res)
                if (res.code===200){
                    if (res.data.length>0){
                        let aGoods=this.state.aGoods;
                        for (let i=0;i<res.data.length;i++){
                            aGoods.push(res.data[i]);
                        }
                        this.setState({aGoods:aGoods},()=>{
                            lazyImg();
                        });
                    }
                }
            });
        });
    }

    render() {
        // console.log('address-this.props', this.state.addressData)
        return (
            <div className={Css['page']}>
                <HeadComponent title='我的收藏'></HeadComponent>
                <div className={Css['item-wrap']}>
                    {
                        this.state.aGoods.length > 0 ?
                            this.state.aGoods.map((item, index) => (
                                <div className={Css['item']} key={index}>
                                    <div className={Css['img']}><img src={item.image} alt={item.title}></img></div>
                                    <div className={Css['title']}>{item.title}</div>
                                    <div className={Css['price']}>￥{item.price}</div>
                                    <div className={Css['action']}>
                                        <div className={Css['buy']}>购买</div>
                                        <div className={Css['delete']}>删除</div>
                                    </div>
                                </div>
                            ))
                            : ''
                    }
                </div>
            </div>
        )
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(MarkIndex)

