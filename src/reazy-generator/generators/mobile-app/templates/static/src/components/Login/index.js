import React, { Component } from 'react';
import { View, H1, Text, Container, Header, Title, Body,
  Content, Form, Item, Input, Label, Button, Icon, Right,
  Left } from 'native-base';
import { observer, inject } from 'mobx-react/native';

@inject("domain.user", "routerActions")
@observer
class Login extends Component {

  onChangeUsername(text) {
    console.log('wadn');
    const userStore = this.props['domain.user'];
    userStore.username = text;
  }

  render() {
    const { routerActions } = this.props;

    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Reazy</Title>
          </Body>
          <Right>
            <Button onPress={routerActions.home} transparent>
              <Icon name="home"/>
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={{flex: 1}}>
          <Form>
            <Item>
              <Input placeholder="Username" onChangeText={text => this.onChangeUsername(text)} />
            </Item>
            <Item last>
              <Input password placeholder="Password" />
            </Item>
          </Form>
          <Button onPress={routerActions.home} block style={{ backgroundColor: '#B94C7F', margin: 10 }}>
            <Text>Login</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Login;
