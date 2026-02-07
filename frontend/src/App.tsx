import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from './pages/LandingPage';
import MLVisualization from './pages/MLVisualization';
import LogoutButton from './components/LogoutButton';

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <div className="flex flex-col items-center justify-center h-screen gap-8">
          <div className="w-12 h-12 border-[3px] border-blue-400/20 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="text-xl text-slate-300 font-medium">Initializing...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen">
        <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-400/40 rounded-2xl p-12 text-center backdrop-blur-md max-w-[500px] w-[90%] mx-auto mt-[10vh]">
          <div className="text-4xl font-bold mb-4 text-red-400">⚠️ Error</div>
          <div className="text-xl text-white mb-2">Something went wrong</div>
          <div className="text-base text-slate-300 opacity-90">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {isAuthenticated ? (
        <div className="flex flex-col w-full min-h-screen p-6 gap-6">
          <div className="flex items-center justify-between bg-slate-800/60 backdrop-blur-md px-8 py-6 rounded-2xl border border-blue-400/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI Research Insights
              </h2>
            </div>
            <LogoutButton />
          </div>
          <MLVisualization />
        </div>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;
