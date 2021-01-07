/*eslint-disable*/
import React from 'react';
import Css from '../../../assets/css/home/goods/detail_review.css';
import { request } from '../../../assets/js/libs/request';
import config from '../../../assets/js/conf/config';
export default class  DetailsReview extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            aReview: '',
            gid: this.props.location.search.split('=')[1]
        }
    }

    componentDidMount(){
        this.getReviewData()
    }

    // 获取评价数据
    getReviewData = () => {
        request(config.baseUrl + '/api/home/reviews/index?gid=' + this.state.gid + '&token=1ec949a15fb709370f&page=1').then((res) => {
            // console.log('detail_item_res', res)
            if (res.code === 200) {
                this.setState({
                    aReview: res.data
                })
            }
        })
    }
    render(){
        // console.log('detail_review', this.props)
        return(
            <div>
                <div className={Css['review-wrap']}>
                    <div className={Css['title']}>商品评价</div>
                    {
                        this.state.aReview.length > 0 ?
                            this.state.aReview.map((item, index) => (
                                <div className={Css['item-wrap']} key={index}>
                                    <div className={Css['user']}>
                                        <div className={Css['user-icon']}><img src={item.head}></img></div>
                                        <div className={Css['username']}>{item.nickname}</div>
                                    </div>
                                    <div className={Css['review']}>{item.content}</div>
                                    <div className={Css['time']}>2020-12-13 09:23:56</div>
                                </div>
                            ))
                            : ''
                    }

                </div>
            </div>
        );
    }
}