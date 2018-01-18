import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Button } from 'react-native'

import { StackNavigator, NavigationActions, addNavigationHelpers } from 'react-navigation'

import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'

class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Home Screen'
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen: {this.props.screenProps.text}</Text>
        <Button
          title="Open Details"
          onPress={() => navigate('Details')}
        />
      </View>
    )
  }
}

const DetailsScreen = ({ screenProps }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
    <Button
      title="Update Text"
      onPress={() => screenProps.setText("new text to be set")}
    />
  </View>
)

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Details: {
    screen: DetailsScreen,
  },
})

const initailState = RootNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Home' }))

const nav = (state = initailState, action) => {
  console.log('nav action', action)
  let nextState = RootNavigator.router.getStateForAction(action, state)
  return nextState || state
}

const textReducer = (state = 'Hello World!', action) => {
  console.log('TextReducer called', state, action)
  switch (action.type) {
    case 'set_text':
      return action.data
    default:
      return state
  }
}

const appReducer = combineReducers({
  nav,
  text: textReducer
})

class AppWithNavigationState extends React.Component {
  render() {
    console.log('AppWithNavigationState: ', this.props, this.state)    
    const { dispatch, nav } = this.props
    return (
      <RootNavigator screenProps={this.props} {...this.props} />
    )
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  nav: state.nav,
  text: state.text //?
})

const mapDispatchToProps = (dispatch) => ({
      setText: (data) => dispatch({ type: 'set_text', data}),
      dispatch
})

ReduxAppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(appReducer)}>
        <ReduxAppWithNavigationState />
      </Provider>
    )
  }
}

