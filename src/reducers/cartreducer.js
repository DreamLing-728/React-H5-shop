let cartData = {
    aCartData: localStorage['cartData'] !== undefined ? JSON.parse(localStorage['cartData']) : [],
    total: localStorage['total'] !== undefined ? parseFloat(localStorage['total']) : 0,
    freight: localStorage['freight'] !== undefined ? parseFloat(localStorage['freight']) : 0
}

// cartData的格式如下
// amount: 1
// attrs: (2) [{…}, {…}]
// checked: true
// freight: 20
// gid: "143208071"
// img: "//vueshop.glbuys.com/uploadfiles/1524556409.jpg"
// price: 12.8
// title: "高跟鞋女2018新款春季单鞋仙女甜美链子尖头防水台细跟女鞋一字带"
function cartReducer(state = cartData, action) {
    // console.log('cartReducer, state, action', state, action);
    switch (action.type) {
        case "addCart":
            addCart(state, action.data);
            return Object.assign({}, state, action);
        case "delItem":
            delItem(state, action.data);
            return Object.assign({}, state, action);
        case "incAmount":
            incAmount(state, action.data);
            return Object.assign({}, state, action);
        case "decAmount":
            decAmount(state, action.data);
            return Object.assign({}, state, action);
        case "checkItem":
            checkItem(state, action.data);
            return Object.assign({}, state, action)
        case "setAllChecked":
            setAllChecked(state, action.data);
            return Object.assign({}, state, action);
        default:
            return state
    }
}

//添加商品
function addCart(state, action) {
    let bSameItem = false;
    if (state.aCartData.length > 0) {
        //如果购物车里有相同的商品：数量加1
        for (let key in state.aCartData) {
            if (state.aCartData[key].gid === action.gid && JSON.stringify(state.aCartData[key].attrs) === JSON.stringify(action.attrs)) {
                state.aCartData[key].amount += 1;
                bSameItem = true;
                break;
            }
        }
    }
    //如果购物车里没有相同的商品：商品加入购入车
    if (!bSameItem) {
        state.aCartData.push(action);
    }

    setTotal(state);
    setFreight(state);
    localStorage['cartData'] = JSON.stringify(state.aCartData);
}

// 删除商品
function delItem(state, action) {
    state.aCartData.splice(action.index, 1);
    setTotal(state);
    setFreight(state);
    localStorage['cartData'] = JSON.stringify(state.aCartData);
}

// 数量加1
function incAmount(state, action){
    for(let key in state.aCartData) {
        if (parseInt(key) === parseInt(action.index)){
            state.aCartData[key].amount ++ ;
            break;
        }
    }
    setTotal(state);
    setFreight(state);
    localStorage['cartData'] = JSON.stringify(state.aCartData);
}

// 数量减1
function decAmount(state, action) {
    for(let key in state.aCartData) {
        if (parseInt(key) === parseInt(action.index)){
            if(state.aCartData[key].amount > 1){
                state.aCartData[key].amount -- ;
            }
            break;
        }
    }
    setTotal(state);
    setFreight(state);
    localStorage['cartData'] = JSON.stringify(state.aCartData);
}

// 修改单个选中
function checkItem(state, action) {
    for(let key in state.aCartData) {
        if (parseInt(key) === parseInt(action.index)){
            state.aCartData[key].checked = ! state.aCartData[key].checked;
            break;
        }
    }
    setTotal(state);
    setFreight(state);
    localStorage['cartData'] = JSON.stringify(state.aCartData);

} 

// 修改全选
function setAllChecked(state, action) {
    for(let key in state.aCartData) {
        console.log('action.checked', action.checked)
        state.aCartData[key].checked = action.checked;
    }
    setTotal(state);
    setFreight(state);
    localStorage['cartData'] = JSON.stringify(state.aCartData);
}




//重新计算总价
function setTotal(state) {
    let total = 0;
    for (let key in state.aCartData) {
        if (state.aCartData[key].checked) {
            total += parseFloat(state.aCartData[key].price) * parseFloat(state.aCartData[key].amount);
        }
    }
    state.total = parseFloat(total.toFixed(2));
    localStorage['total'] = state.total;
}

//计算运费
function setFreight(state) {
    console.log('reducer-setFreight', state)
    let aFreight = [];
    for (let key in state.aCartData) {
        if (state.aCartData[key].checked) {
            aFreight.push(state.aCartData[key].freight);
        }
    }
    state.freight = Math.max.apply(null, aFreight);
    localStorage['freight'] = state.freight;
}

export default cartReducer;