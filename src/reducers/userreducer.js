let defaultState = {
    uid: localStorage['uid'] !== undefined ? localStorage['uid'] : '',
    nickname: localStorage['nickname'] !== undefined ? localStorage['nickname'] : '',
    authToken: localStorage['authToken'] !== undefined ? localStorage['authToken'] : '',
    isLogin: localStorage['isLogin'] !== undefined ? Boolean(localStorage['isLogin']) : false
}

function userReducer(state = defaultState, action) {
    switch (action.type) {
        case 'login':
            tologin(state, action.data);
            return Object.assign({}, state, action)
        case 'outLogin':
            outLogin(state, action.data);
            return Object.assign({}, state, action)
        default:
            return state;
    }
}

function tologin(state, action) {
    // console.log('userreducer-login-1', state, action);
    state.uid = action.uid;
    state.nickname = action.nickname;
    state.authToken = action.authToken;
    state.isLogin = true;
    // console.log('userreducer-login-2', state, action);
}

function outLogin(state, action) {
    // console.log('userreducer-outLogin-1', state, action);
    localStorage.removeItem('uid');
    localStorage.removeItem('nickname');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isLogin');
    state.uid = '';
    state.nickname = '';
    state.authToken = '';
    state.isLogin = false;
    // console.log('userreducer-outLogin-2', state, action);
}

export default userReducer;