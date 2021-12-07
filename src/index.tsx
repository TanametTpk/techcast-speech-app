import 'index.scss';
import 'antd/dist/antd.css';
import * as serviceWorker from 'serviceWorker';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import store from 'state/store';
import Home from 'components/Home';
import Macro from 'components/Macro';

// TODO - import python code
// TODO - bind logic to UI

ReactDOM.render(
  <>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/macros" element={<Macro />} />
        </Routes>
      </Router>
    </Provider>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
