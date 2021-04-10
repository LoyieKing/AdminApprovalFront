import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { storage } from 'ra-lib';
import App from './App';
import { store } from './models';
import * as serviceWorker from './serviceWorker';
import { getLoginUser } from './commons';

import './index.css';
import './index.mobile.css';

const currentUser = getLoginUser() || {};

// 存储初始化 区分不同用户存储的数据
storage.init({
    keyPrefix: currentUser.id,
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
