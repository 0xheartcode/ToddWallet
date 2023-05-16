import React from 'react';

import {Route, Routes} from 'react-router-dom'
import Page404 from "../pages/Page404";
import Home from "../pages/Home";

function AppRoutes() {
    return <Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path={"*"} element={<Page404/>}/>
    </Routes>
}

export default AppRoutes;