import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-black overflow-x-hidden">
      {/* Animated background with purple/blue glowing elements */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 top-[-300px] left-[-200px] animate-float"
          style={{ background: 'radial-gradient(circle, #9333ea 0%, #6366f1 50%, transparent 70%)' }}
        ></div>
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-25 bottom-[-200px] right-[-150px] animate-float-delay-1"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, #9333ea 50%, transparent 70%)' }}
        ></div>
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 top-1/2 right-[5%] animate-float-delay-2"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #6366f1 50%, transparent 70%)' }}
        ></div>
      </div>

      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-8 py-4 pointer-events-none">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg
                width="40"
                height="40"
                viewBox="0 0 280 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                
                {/* Central node */}
                <circle cx="140" cy="140" r="12" fill="url(#nodeGradient)" />
                
                {/* Four outer nodes */}
                <circle cx="140" cy="80" r="8" fill="#c084fc" />
                <circle cx="200" cy="140" r="8" fill="#c084fc" />
                <circle cx="140" cy="200" r="8" fill="#c084fc" />
                <circle cx="80" cy="140" r="8" fill="#c084fc" />
                
                {/* Connection lines from center to outer nodes */}
                <line x1="140" y1="140" x2="140" y2="80" stroke="#a855f7" strokeWidth="2.5" opacity="0.9" />
                <line x1="140" y1="140" x2="200" y2="140" stroke="#a855f7" strokeWidth="2.5" opacity="0.9" />
                <line x1="140" y1="140" x2="140" y2="200" stroke="#a855f7" strokeWidth="2.5" opacity="0.9" />
                <line x1="140" y1="140" x2="80" y2="140" stroke="#a855f7" strokeWidth="2.5" opacity="0.9" />
              </svg>
            </div>
            <span className="text-white font-semibold text-base md:text-lg tracking-wide">ARIADNE</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="relative text-white/80 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 hover:backdrop-blur-sm group">
              <span className="relative z-10">Devpost</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button className="relative text-white/80 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 hover:backdrop-blur-sm group">
              <span className="relative z-10">About</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button
              onClick={() => loginWithRedirect()}
              className="relative px-6 py-2.5 text-white text-sm font-medium rounded-lg border border-white/40 hover:border-white transition-all duration-300 hover:bg-white/5 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign In
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Fixed Main Content - Hero Section */}
      <main className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center max-w-4xl mx-auto px-8 w-full pointer-events-auto">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
            ARIADNE
          </h1>

          {/* Description - swaps on scroll with smooth animation */}
          <div className="min-h-[200px] relative">
            <div 
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                !scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto font-light">
                Discover the future of academic research with Ariadne — an ArXiV paper recommendation system powered by Graph Neural Network link prediction. Navigate the vast landscape of scientific literature with intelligent, context-aware recommendations.
              </p>
            </div>
            <div 
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto font-light space-y-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Scrollable content area */}
      <div className="relative z-0" style={{ minHeight: '200vh' }}>
        <div className="h-screen"></div>
        <div className="min-h-screen"></div>
      </div>
    </div>
  );
};

export default LandingPage;
