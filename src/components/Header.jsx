import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold">
                        Web Builder
                    </Link>

                    <div className="hidden md:flex space-x-8">
                        <Link
                            to="/"
                            className={`hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600 font-medium' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className={`hover:text-blue-600 ${location.pathname === '/about' ? 'text-blue-600 font-medium' : ''}`}
                        >
                            About
                        </Link>
                        <Link
                            to="/portfolio"
                            className={`hover:text-blue-600 ${location.pathname === '/portfolio' ? 'text-blue-600 font-medium' : ''}`}
                        >
                            Portfolio
                        </Link>
                        <Link
                            to="/pricing"
                            className={`hover:text-blue-600 ${location.pathname === '/pricing' ? 'text-blue-600 font-medium' : ''}`}
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/contact"
                            className={`hover:text-blue-600 ${location.pathname === '/contact' ? 'text-blue-600 font-medium' : ''}`}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;