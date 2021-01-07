import React from 'react';
import HeadComponent from '../../../components/head/head';
import { connect } from 'react-redux';
import Css from '../../../assets/css/home/address/index.css';
import config from '../../../assets/js/conf/config';
import { request } from '../../../assets/js/libs/request';
import { Modal } from 'antd-mobile';
// const { confirm } = Modal;
class addressIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.state.user.uid,
            addressList: []
        };

    }
    componentDidMount() {

        this.getAddressList();
    }

    getAddressList() {
        let url = config.baseUrl + '/api/user/address/index?uid=' + this.state.uid + '&token=' + config.token;
        request(url, 'get').then((res) => {
            console.log('address-index-res', res)
            if (res.code === 200) {
                this.setState({
                    addressList: res.data
                })
            }
        })
    }

    // 跳转新增地址
    pushPage(sUrl) {
        // console.log('address-index-跳转地址', config.path + sUrl)
        this.props.history.push(config.path + sUrl);
    }

    // 编辑地址
    editPage(e, sUrl, aid) {
        e.stopPropagation();
        let url = config.path + sUrl + '?aid=' + aid
        this.props.history.push(url);   
    }

    // 删除地址
    deleteAddress(e, index, aid) {
        // console.log(e);
        e.stopPropagation();
        Modal.alert('', '确认删除?', [
            { text: '取消', onPress: () => { }, style: 'default' },
            {
                text: '确定', onPress: () => {
                    // let sUrl=config.baseUrl+"/api/user/address/del?uid="+this.props.state.user.uid+"&aid="+aid+"&token="+config.token;
                    let url = config.baseUrl + '/api/user/address/del?uid=' + this.state.uid + '&aid=' + aid + '&token=' + config.token;
                    request(url).then((res) => {
                        // config.log('delete-addr  ess', res);
                        if (res.code === 200) {
                            config.log('delete-address', res);
                            let addressListTemp = this.state.addressList;
                            for (let i = 0; i < addressListTemp.length; i++) {
                                if (i === index) {
                                    addressListTemp.splice(index, 1);
                                    break;
                                }
                            }
                            this.setState({ addressList: addressListTemp })
                        }else{
                            console.log(res.data)
                        }

                    })

                }
            },
        ]);

        // confirm({
        //     title: '确认删除？',
        //     onOK() {
        //         let addressListTemp = this.state.addressList;
        //         for (let i = 0; i < addressListTemp.length; i++) {
        //             if (i === index) {
        //                 addressListTemp.splice(index, 1);
        //                 break;
        //             }
        //         }
        //         this.setState({ addressList: addressListTemp })
        //     }
        // })


    }

    // 选择地址
    chooseAddress(e, aid) {
        console.log('address-index-chooseAddress', e);
        localStorage['addressId'] = aid;
        this.props.history.goBack();
    }

    render() {
        console.log('address-index', this.state.addressList)
        return (
            <div className={['page']}>
                <HeadComponent title='选择收货地址'></HeadComponent>
                <div className={Css['top-wrap']}>
                    <div className={Css['title']}>配送地址</div>
                    <div className={Css['add']} onClick={this.pushPage.bind(this, 'address/add')}>+添加新的地址</div>
                </div>
                {this.state.addressList.length > 0 ?
                    this.state.addressList.map((item, index) => (
                        <div className={Css['item-wrap']} key={index} onClick={(e) => {
                            this.chooseAddress(e, item.aid)
                        }}>
                            <div className={Css['name-cell']}>
                                <div className={Css['name']}>{item.name}</div>
                                <div className={Css['cell']}>{item.cellphone}</div>
                                {item.isdefault > 0 ?
                                    <div className={Css['isdefault']}>默认</div>
                                    : ''}
                            </div>
                            <div className={Css['address-edit']}>
                                <div className={Css['address']}>{item.province + item.city + item.area + item.address}</div>
                                <div className={Css['edit-wrap']} >
                                    <div className={Css['edit']} onClick={(e) => { this.editPage(e, 'address/edit', item.aid) }}>编辑</div>
                                    <div className={Css['delete']} onClick={(e) => { this.deleteAddress(e, index, item.aid) }}>删除</div>
                                </div>
                            </div>
                        </div>
                    ))
                    : '没有收货地址，请添加！'
                }
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state
    }
})(addressIndex)