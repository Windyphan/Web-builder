import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiFileText, FiCreditCard, FiClock, FiFolder,
    FiBarChart2, FiUsers, FiBriefcase, FiLogOut, FiMenu,
    FiX, FiChevronLeft, FiChevronRight, FiEdit
} from 'react-icons/fi';

const NAV_ITEMS = [
    { label: 'Dashboard',    icon: FiGrid,      path: '/admin',          exact: true },
    { label: 'Invoices',     icon: FiFileText,  path: '/admin/invoices'               },
    { label: 'Expenses',     icon: FiCreditCard,path: '/admin/expenses'               },
    { label: 'Time Tracking',icon: FiClock,     path: '/admin/time'                   },
    { label: 'Projects',     icon: FiFolder,    path: '/admin/projects'               },
    { label: 'Clients',      icon: FiUsers,     path: '/admin/clients'                },
    { label: 'Reports',      icon: FiBarChart2, path: '/admin/reports'                },
    { label: 'Payroll',      icon: FiBriefcase, path: '/admin/payroll'                },
    { label: 'Blog',         icon: FiEdit,      path: '/admin/blog'                   },
];

const AdminSidebar = ({ onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        if (onLogout) onLogout();
        navigate('/');
    };

    const NavItems = ({ onItemClick }) => (
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={onItemClick}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                            isActive
                                ? 'bg-primary-600 text-white shadow-glow-blue'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        } ${collapsed ? 'justify-center' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <item.icon
                                size={18}
                                className={`flex-shrink-0 transition-colors ${
                                    isActive
                                        ? 'text-white'
                                        : 'text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400'
                                }`}
                            />
                            <AnimatePresence initial={false}>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {/* Tooltip when collapsed */}
                            {collapsed && (
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );

    const SidebarFooter = ({ onItemClick }) => (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 space-y-0.5">
            {/* Collapse toggle — desktop only */}
            <button
                onClick={() => setCollapsed(c => !c)}
                className={`hidden md:flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
                {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                {!collapsed && <span className="text-sm font-medium">Collapse</span>}
            </button>

            {/* Logout */}
            <button
                onClick={() => { if (onItemClick) onItemClick(); handleLogout(); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
                <FiLogOut size={18} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
        </div>
    );

    const Logo = () => (
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 ${collapsed ? 'justify-center px-2' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow-blue">
                <FiGrid className="text-white" size={15} />
            </div>
            <AnimatePresence initial={false}>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight whitespace-nowrap">
                            FlowERP
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">Admin Panel</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <>
            {/* ── Mobile hamburger ── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-premium border border-gray-200 dark:border-gray-700"
            >
                <FiMenu size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* ── Mobile backdrop ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Mobile sidebar ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside
                        className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-2xl border-r border-gray-200 dark:border-gray-700 flex flex-col"
                        initial={{ x: -256 }}
                        animate={{ x: 0 }}
                        exit={{ x: -256 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    >
                        <div className="absolute top-3 right-3 z-10">
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        <Logo />
                        <NavItems onItemClick={() => setMobileOpen(false)} />
                        <SidebarFooter onItemClick={() => setMobileOpen(false)} />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Desktop sidebar ── */}
            <motion.aside
                className="hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 flex-shrink-0 overflow-hidden"
                animate={{ width: collapsed ? 68 : 240 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
                <Logo />
                <NavItems />
                <SidebarFooter />
            </motion.aside>
        </>
    );
};

export default AdminSidebar;




