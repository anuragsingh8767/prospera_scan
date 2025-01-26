import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ApiPage from './Pages/APIs/Apis';
import DataSource from './Pages/DataSource/DataSource';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DataSource />} />
            <Route path="/about" element={<ApiPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
