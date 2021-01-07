/*eslint-disable*/
import 'babel-polyfill';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RouterComponent from './router';
import * as serviceWorker from './serviceWorker';
import "./assets/css/common/public.css";
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers';

let store = createStore(reducers);
// console.log('store-index',store)
class Index extends React.Component{
    render(){
        // console.log(localStorage);
        return(
            <React.Fragment>
                <Provider store = {store}>
                    <RouterComponent></RouterComponent>
                </Provider>
            </React.Fragment>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
