
// console.log(localStorage);
let aKeywords=localStorage['hk']!==undefined?JSON.parse(localStorage['hk']):[];
function hkReducer(state={keywords: aKeywords}, action){
    // console.log('hkReducer, state, action',  state, action);
    switch (action.type) {
        case "addHk":
            return Object.assign({}, state, action);
        default:
            return state;
    }
}

export default hkReducer;
