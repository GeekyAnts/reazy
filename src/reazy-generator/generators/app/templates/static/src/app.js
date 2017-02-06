import reazy from 'reazy';
import mobx from './services/mobx';
import routerActions from 'reazy-native-router-actions';
import reactNative from './services/react-native';

const app = reazy();

app.use(mobx(), 'state');
app.use(routerActions(), 'routerActions');
app.use(reactNative(), 'reactNative');

export default app;
