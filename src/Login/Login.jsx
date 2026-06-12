import React, { useState } from "react";
import AnimatedBackground from "./AnimatedBackground";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      dir="rtl"
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Dark Background */}
      <div className="absolute inset-0 bg-black z-0">
        <AnimatedBackground />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full z-[1]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[160px] rounded-full z-[1]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="
            bg-slate-900/70
            backdrop-blur-3xl
            rounded-3xl
            border border-white/10
            shadow-[0_0_60px_rgba(59,130,246,0.15)]
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-8 pt-12 pb-8 text-center border-b border-white/10">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-800 flex items-center justify-center border border-white/10 mb-6 overflow-hidden">
              <img
                src="/favicon.png"
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold text-white">
              سامانه جامع مدیریت
            </h1>

            <p className="text-slate-400 mt-3">
              لطفاً اطلاعات ورود خود را وارد نمایید
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            <div>
              <label className="block mb-2 text-slate-300">
                نام کاربری
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full
                  bg-slate-800/80
                  border border-slate-700
                  rounded-xl
                  p-4
                  text-white
                  outline-none
                  focus:border-blue-500
                "
                placeholder="نام کاربری"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300">
                رمز عبور
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    bg-slate-800/80
                    border border-slate-700
                    rounded-xl
                    p-4
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                  placeholder="رمز عبور"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              className="
                w-full
                py-4
                rounded-xl
                font-bold
                text-white
                bg-gradient-to-r
                from-blue-700
                to-blue-500
                hover:from-blue-800
                hover:to-blue-600
                transition-all
              "
            >
              ورود به سامانه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;