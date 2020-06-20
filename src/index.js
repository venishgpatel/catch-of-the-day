import React from 'react';
import { render } from 'react-dom';
import './css/style.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './components/notFound';
import Home from './components/home';
import StorePicker from './components/storePicker';


const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={StorePicker} />
                    <Route path="/store/:storeId" component={Home} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

render(<App/>, document.querySelector('#main'));