import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="px-8 py-4 text-base font-semibold rounded-lg border-none cursor-pointer transition-all duration-300 ease-out outline-none uppercase tracking-wider shadow-lg bg-gradient-to-r from-red-400 to-red-600 text-slate-900 hover:transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-red-400/50"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
