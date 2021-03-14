import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import StockChartComponent from './components/StockChartComponent'
import Chatroom from './components/Chatroom'
import StockNews from './components/StockNews'

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/stockchart" component={StockChartComponent}></Route>
        <Route path="/chat" component={Chatroom}></Route>
        <Route path="/stocknews" component={StockNews}></Route>
      </Switch>
    )
  }
}

export default Routes
