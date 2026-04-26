export default function Home() {
  return (
    <div className="font-body text-body text-foreground min-h-screen flex flex-col items-center justify-center p-4">
      {/* Marquee */}
      <div className="marquee-container w-full max-w-[1024px] mb-8 py-2">
        {/* @ts-expect-error - marquee is a legacy tag but used for retro effect */}
        <marquee
          className="font-h2-section text-h2-section text-success tracking-widest uppercase"
          scrollamount="15"
          style={{ color: "#00FF00" }}
        >
          WELCOME TO GOOGLE! SEARCH THE WORLD WIDE WEB!
        </marquee>
      </div>

      {/* Main Window */}
      <main className="w-full max-w-[800px] bg-background outset-bevel flex flex-col p-[2px]">
        {/* Title Bar */}
        <div className="title-bar w-full h-[24px] flex items-center justify-between px-1 mb-1">
          <span className="font-label-xs text-label-xs text-on-primary font-bold">
            Google.exe
          </span>
          <div className="flex gap-[2px]">
            <button className="w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center p-0">
              <span className="material-symbols-outlined text-[10px] text-foreground font-bold leading-none -mt-[2px]">
                minimize
              </span>
            </button>
            <button className="w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center p-0">
              <span className="material-symbols-outlined text-[10px] text-foreground font-bold leading-none -mt-[2px]">
                check_box_outline_blank
              </span>
            </button>
            <button className="w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center p-0">
              <span className="material-symbols-outlined text-[10px] text-foreground font-bold leading-none -mt-[2px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <header className="bg-zinc-300 border-b-2 border-zinc-600 shadow-[0_1px_0_0_#ffffff] px-4 py-2 flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 italic tracking-tighter text-3xl font-black drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
              Google
            </span>
            <nav className="flex gap-4">
              <a
                className="uppercase tracking-widest text-xs font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200"
                href="#"
              >
                Images
              </a>
              <a
                className="uppercase tracking-widest text-xs font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200"
                href="#"
              >
                Maps
              </a>
              <a
                className="uppercase tracking-widest text-xs font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200"
                href="#"
              >
                Play
              </a>
              <a
                className="uppercase tracking-widest text-xs font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200"
                href="#"
              >
                YouTube
              </a>
              <a
                className="uppercase tracking-widest text-xs font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200"
                href="#"
              >
                Gmail
              </a>
              <a
                className="uppercase tracking-widest text-xs font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200"
                href="#"
              >
                Drive
              </a>
            </nav>
          </div>
          <button className="bg-background outset-bevel-button px-2 py-1 font-label-xs text-label-xs font-bold uppercase tracking-widest text-foreground hover:bg-zinc-200">
            Sign In
          </button>
        </header>

        {/* Content Area */}
        <div className="bg-panel-yellow inset-bevel p-8 m-2 flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-1 my-8">
            <span
              className="font-h1-hero text-h1-hero text-primary-container"
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #fff" }}
            >
              G
            </span>
            <span
              className="font-h1-hero text-h1-hero text-secondary"
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #fff" }}
            >
              o
            </span>
            <span
              className="font-h1-hero text-h1-hero text-tertiary"
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #fff" }}
            >
              o
            </span>
            <span
              className="font-h1-hero text-h1-hero text-primary-container"
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #fff" }}
            >
              g
            </span>
            <span
              className="font-h1-hero text-h1-hero text-success-dark"
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #fff" }}
            >
              l
            </span>
            <span
              className="font-h1-hero text-h1-hero text-secondary"
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #fff" }}
            >
              e
            </span>
          </div>

          {/* Search Form */}
          <form className="w-full max-w-[600px] flex flex-col items-center gap-6">
            <div className="w-full flex items-center bg-on-tertiary inset-bevel px-2 py-1">
              <span className="material-symbols-outlined text-muted mr-2">
                search
              </span>
              <input
                className="w-full bg-transparent border-none outline-none font-body text-body text-foreground placeholder-muted focus:ring-0 p-0"
                placeholder="Search the web..."
                type="text"
              />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-background outset-bevel-button px-6 py-2 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground"
                type="button"
              >
                Google Search
              </button>
              <button
                className="bg-background outset-bevel-button px-6 py-2 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground"
                type="button"
              >
                I'm Feeling Lucky
              </button>
            </div>
          </form>

          {/* Links & Badges */}
          <div className="flex items-center gap-2 mt-8">
            <span className="bg-secondary text-on-secondary font-label-xs text-label-xs px-1 py-[2px] blink border border-foreground font-bold">
              NEW!
            </span>
            <a className="retro-link font-body text-body font-bold" href="#">
              Try Google Images!
            </a>
          </div>
        </div>
      </main>

      {/* Hit Counter */}
      <div className="mt-12 bg-foreground outset-bevel p-2 flex flex-col items-center border border-muted">
        <span className="font-label-xs text-label-xs text-on-tertiary mb-1 uppercase tracking-widest">
          Search Requests Served:
        </span>
        <div className="bg-foreground inset-bevel px-4 py-2 border border-[#404040]">
          <span
            className="font-monospace-stat text-[24px] text-success tracking-[0.2em] font-bold"
            style={{ textShadow: "0 0 5px #00FF00" }}
          >
            00001997
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 bg-zinc-300 border-t-2 border-zinc-600 shadow-[0_-1px_0_0_#ffffff] max-w-[1024px] mx-auto py-6 px-4 flex flex-col items-center gap-4 w-full">
        <nav className="flex gap-4">
          <a
            className="text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer"
            href="#"
          >
            Advertising
          </a>
          <a
            className="text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer"
            href="#"
          >
            Business
          </a>
          <a
            className="text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer"
            href="#"
          >
            About
          </a>
          <a
            className="text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer"
            href="#"
          >
            Settings
          </a>
        </nav>
        <div className="text-sm font-bold text-zinc-900 text-[10px] leading-tight">
          Copyright ©1997 Google Inc.
        </div>
      </footer>
    </div>
  );
}
