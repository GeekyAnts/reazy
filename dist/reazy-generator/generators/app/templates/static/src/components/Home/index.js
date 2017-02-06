import React, { Component } from 'react';
import { View, H1, Text } from 'native-base';
import { observer, inject } from 'mobx-react/native';

@inject("view.app", "domain.user", "app", "routerActions")
@observer
class Home extends Component {

  render() {
    const userStore = this.props['domain.user'];

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8FCFB8'}}>
        <H1>
          Reazy native seed
        </H1>
        <Text>
          {`Welcome, ${userStore.username}`}
        </Text>
      </View>
    );
  }
}

export default Home;
