import { useState, useCallback, memo, type JSX } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, X, LogIn, ChevronDown, ChevronUp } from 'lucide-react';
import heartImg from '../assets/nowCareLogo.png';

const NavLinkItem = memo(({ link }: { link: { name: string; path: string } }) => (
  <li>
    <a
      href={link.path}
      className="px-4 py-2 text-sm font-medium hover:text-primary-600 transition-colors duration-200 flex items-center"
      aria-label={`Navigate to ${link.name}`}
    >
      {link.name}
    </a>
  </li>
));

const ResearchDropdownItem = memo(({ item }: { item: { name: string; path: string; icon: string } }) => (
  <a
    href={item.path}
    className=" px-4 py-3 text-sm hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 border-b border-gray-100 last:border-0"
    aria-label={`Research: ${item.name}`}
  >
    <span className="text-xl">{item.icon}</span>
    <span className="font-medium">{item.name}</span>
  </a>
));

const Navbar = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResearchOpen, setIsResearchOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleResearchMenu = useCallback(() => {
    setIsResearchOpen(prev => !prev);
  }, []);

  const navLinks = [
    { name: 'Experts', path: '/experts' },
    { name: 'Services', path: '/ourservice' },
    { name: 'Calculators', path: '/calculators' },
    { name: 'Program', path: '/programs' },
    { name: 'Blog', path: '/blog' },
    { name: 'Mental Health', path: '/mental-health' },
    { name: 'Career', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  const researchItems = [
    { name: 'Genetics: RNA Based Cancer Treatment', path: '/rnatherapy', icon: '🧬' },
    { name: 'Neurology: Electrode Human Brain Plus Detection', path: '/neurology', icon: '⚡' },
  ];

  return (
    <>
      <Helmet>
        <title>Nowcare4U - Young & Healthy Forever</title>
        <meta name="description" content="Nowcare4U provides comprehensive healthcare services, research, and products to help you stay young and healthy forever." />
        <meta name="keywords" content="healthcare, medical services, RNA therapy, cancer treatment, mental health, covid testing" />
        <meta property="og:title" content="Nowcare4U - Young & Healthy Forever" />
        <meta property="og:description" content="Comprehensive healthcare services and innovative medical research" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.nowcare4u.com" />
      </Helmet>

      <nav className="bg-white text-gray-800 shadow-sm w-full sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <a href="/" className="flex items-center" aria-label="Nowcare4U Home">
                <img
                  src={heartImg}
                  alt="Nowcare4U Logo"
                  className="w-10 h-10 object-contain"
                  width="40"
                  height="40"
                  loading="lazy"
                />
                <div className="flex flex-col leading-tight ml-2">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold tracking-tight">Nowcare</span>
                    <span className="text-2xl font-bold text-red-400 tracking-tight">4U</span>
                  </div>
                  <span className="text-gray-500 text-xs font-light">Young & Healthy Forever</span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <ul className="flex space-x-6">
                {navLinks.map(link => (
                  <NavLinkItem key={link.name} link={link} />
                ))}

                {/* Research Dropdown */}
                <li className="relative">
                  <button
                    onClick={toggleResearchMenu}
                    className="px-4 py-2 flex items-center space-x-1 text-sm font-medium hover:text-primary-600 transition-colors duration-200"
                    aria-expanded={isResearchOpen}
                    aria-label="Research menu"
                  >
                    <span>Research</span>
                    {isResearchOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isResearchOpen && (
                    <div className="absolute left-0 mt-1 w-72 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-100">
                      {researchItems.map(item => (
                        <ResearchDropdownItem key={item.name} item={item} />
                      ))}
                    </div>
                  )}
                </li>
              </ul>

              <a
                href="/login"
                className="px-5 py-2.5 flex items-center space-x-2 text-sm font-medium bg-primary-600 text-black hover:bg-primary-700 rounded-lg transition-all duration-200 shadow-sm"
                aria-label="Login to your account"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                aria-label="Main menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg transition-all duration-300 ease-in-out">
            <div className="px-4 py-3 space-y-3">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.path}
                  className="block px-4 py-3 text-sm text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-all duration-200"
                  aria-label={`Navigate to ${link.name}`}
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile Research Dropdown */}
              <div>
                <button
                  onClick={toggleResearchMenu}
                  className="w-full flex justify-between items-center px-4 py-3 text-sm text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-all duration-200"
                  aria-expanded={isResearchOpen}
                  aria-label="Research menu"
                >
                  <span>Research</span>
                  {isResearchOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isResearchOpen && (
                  <div className="pl-6 py-2 space-y-2">
                    {researchItems.map(item => (
                      <a
                        key={item.name}
                        href={item.path}
                        className=" px-4 py-2 text-sm text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center space-x-3"
                        aria-label={`Research: ${item.name}`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/login"
                className="flex items-center space-x-2 px-4 py-3 text-sm font-medium bg-primary-600 text-black hover:bg-primary-700 rounded-lg transition-all duration-200 justify-center"
                aria-label="Login to your account"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;