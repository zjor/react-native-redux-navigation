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
        <Text>Home Screen</Text>
        <Button
          title="Open Details"
          onPress={() => navigate('Details')}
        />
      </View>
    )
  }
}

const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
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

const appReducer = combineReducers({
  nav
})

const AppWithNavigationState = ({ dispatch, nav }) => (
  <RootNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
)

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  nav: state.nav,
})

ReduxAppWithNavigationState = connect(mapStateToProps)(AppWithNavigationState)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(appReducer)}>
        <ReduxAppWithNavigationState />
      </Provider>
    )
  }
}

