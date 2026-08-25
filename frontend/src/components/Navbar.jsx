import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-white"
        >
          SupportSphere
          <span className="text-cyan-400">AI</span>
        </button>


        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <a
            href="#features"
            className="text-slate-300 hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-white"
          >
            How It Works
          </a>

          <a
            href="#pricing"
            className="text-slate-300 hover:text-white"
          >
            Pricing
          </a>

        </div>


        {/* Auth Buttons */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-4 py-2 text-slate-300 hover:text-white"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Create Account
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;