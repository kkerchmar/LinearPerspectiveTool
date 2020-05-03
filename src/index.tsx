import './index.scss'

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './modules/main/Main';

window.onload = () => {
    const appContainer = document.getElementById('app-container');
    ReactDOM.render(<Main></Main>, appContainer);
};
