import reazy from 'reazy';
import react from './services/react';
import mobx from './services/mobx';

const app = reazy();

app.use(mobx(), 'state');
app.use(react(), 'react');

export default app;
