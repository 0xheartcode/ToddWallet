import React from 'react';
import './App.scss';

import Header from "./pages/Header";
import AppRoutes from "./routes/AppRoutes";


function App() {
    return <>
        {/*Header*/}
        <Header/>

        {/*Body*/}
        <div className={"p-4"}>
            <AppRoutes/>
        </div>

    </>
}

export default App;