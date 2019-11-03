import React from 'react'
import Home from './pages/Home'
import Notification from './pages/Notification'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <HashRouter>
                    <Switch>
                        <Route path="/" exact={true} component={Home} />
                        <Route path="/notification" component={Notification} />
                    </Switch>
                </HashRouter>
            </PersistGate>
        </Provider>
    )
}

export default App
