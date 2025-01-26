import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css';
import { Divider } from 'primereact/divider';
import './SidebarMenu.css';

const MySidebar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();

    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    const menuItems = [
        {
            label: 'Data Source',
            icon: 'pi pi-database',
            path: '/',
        },
        {
            label: 'APIs',
            icon: 'pi pi-cloud',
            path: '/About',
        },
    ];

    return (
        <div className={`p-d-flex p-flex-column sidebar ${collapsed ? 'p-sidebar-collapsed' : 'p-sidebar-expanded'}`}>
            <div className="p-sidebar-header p-toggle-button cursor-pointer" onClick={handleCollapsedChange}>
                {/* <div
                    className="p-toggle-button cursor-pointer"
                    onClick={handleCollapsedChange}
                > */}
                <i className={`pi ${collapsed ? 'pi-chevron-right' : 'pi-chevron-left'}`}></i>
                <Divider />
                {/* </div> */}
            </div>
            <div className="p-menu-sidebar">
                <ul className="p-menu-list">
                    {menuItems.map((item, index) => (
                        <>
                            <li
                                key={index}
                                className="p-menuitem"
                                onClick={() => {
                                    console.log(`${item.label} clicked`);
                                    navigate(item.path);
                                }}
                            >
                                <i className={`pi ${item.icon} p-menuitem-icon`}></i>
                                <span className="p-menuitem-text">{item.label}</span>
                            </li>
                            <Divider />
                        </>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MySidebar;
