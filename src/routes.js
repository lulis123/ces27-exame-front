import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Owner from './pages/Owner.js';
import Requester from './pages/Requester.js';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/owner" render={() => <Owner />} />
                <Route path="/requester" render={() => <Requester />} />
            </Switch>
        </BrowserRouter>
    );
}