import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Features/auth/authSlice';
import 'primeicons/primeicons.css';
import './Menubar.css';

export default function MenuBar() {
    const username = useSelector((state) => state.auth.username);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const end = (
        <div className="end-div">
            <span className="username">{username}</span>
            <Avatar
                image="https://placehold.co/400"
                shape="circle"
                className="avatar"
            />
            <Button
                icon="pi pi-sign-out"
                className="logout-icon-button"
                onClick={handleLogout}
                aria-label="Logout"
            />
        </div>
    );

    return (
        <div className="menubar-container">
            <Menubar start={<div className="menubar-title">ProsperaScan</div>} end={end} />
        </div>
    );
}
