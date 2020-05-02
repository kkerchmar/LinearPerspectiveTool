import './main.scss'

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Main } from './modules/main/Main';

class App {
    public OnLoad() {
        const appContainer = document.getElementById('app-container');
        ReactDOM.render(<Main></Main>, appContainer);
    }
}

var app = new App();
window.onload = app.OnLoad.bind(app);
