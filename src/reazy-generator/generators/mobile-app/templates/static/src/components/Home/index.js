import React, { Component } from 'react';
import { View, H1, Text, Container, Header, Title, Body, Content,
  Button, Icon, Left, Right } from 'native-base';
import { observer, inject } from 'mobx-react/native';

@inject("view.app", "domain.user", "app", "routerActions")
@observer
class Home extends Component {

  render() {
    const userStore = this.props['domain.user'];
    const { routerActions } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Button onPress={routerActions.pop} transparent>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Title>Reazy</Title>
          </Body>
          <Right />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <H1 style={{ color: '#B94C7F' }}>
              Reazy native seed
            </H1>
            <Text style={{ color: '#B94C7F' }}>
              {`Welcome, ${userStore.username}`}
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Home;
