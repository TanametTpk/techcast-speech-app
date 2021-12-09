import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import 'antd/dist/antd.css';
import HomePage from './pages/Home';
import MacroPage from './pages/Macro';
import SettingPage from './pages/Settings';
import Waiting from './pages/Waiting';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/macros" component={MacroPage} />
        <Route path="/settings" component={SettingPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/" component={Waiting} />
      </Switch>
    </Router>
  );
}
