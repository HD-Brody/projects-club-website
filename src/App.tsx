import { useState, useEffect } from "react";
import EscapeRoomPage from "./EscapeRoom";

// ⬇️ Replace these with your real images (GitHub, Google Drive public links, or /public folder paths)
const GALLERY = [
  { src: "/HTFgroupPhoto.JPG", alt: "Hack The Future 2025" },
  { src: "/HTFworkshop.JPG", alt: "Workshop crowd" },
  { src: "/HTFpitch.JPG", alt: "Hack The Future Pitch" },
  { src: "/HTFspeaker.webp", alt: "Hack The Future Speaker" },
  { src: "/HTFjudges.JPG", alt: "Judge Panel" },
  { src: "/HTFrandomTeam.JPG", alt: "Team collaboration" }
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [route, setRoute] = useState(window.location.hash || "");
  
  useEffect(() => {
    document.title = "Projects Club — University of Toronto";
    const onHash = () => setRoute(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openLightbox = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  if (route === '#/escape') {
    return <EscapeRoomPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">PC</div>
            <div className="leading-tight">
              <p className="font-semibold">UofT Projects Club</p>
              <p className="text-xs text-slate-500">Bridge business × tech</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#events" className="hover:text-slate-900">Events</a>
            <a href="#gallery" className="hover:text-slate-900">Photos</a>
            <a href="#sponsors" className="hover:text-slate-900">Sponsors</a>
            <a href="#join" className="px-3 py-1.5 rounded-full bg-slate-900 text-white hover:opacity-90">Join us</a>
            {/* Prominent Escape Room CTA (desktop) */}
            <a href="#/escape" aria-label="Open Escape Room registration" className="ml-3 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold shadow-2xl hover:scale-105 transform transition-all animate-pulse">
              <span className="text-lg">🧩</span>
              <span>Register: Escape Room</span>
            </a>
          </nav>
        </div>
      </header>
    
    {/* Floating mobile CTA: visible on small screens only */}
    <a href="#/escape" aria-label="Open Escape Room registration" className="fixed bottom-6 right-6 z-50 md:hidden bg-amber-500 text-white p-4 rounded-full shadow-2xl transform-gpu hover:scale-105 transition-transform animate-bounce grid place-items-center">🧩</a>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-20 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Build real things. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Together.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Projects Club connects Rotman Commerce and CS students to ship portfolio‑worthy projects: hackathons, build nights, workshops, and industry collabs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1h5CuLi0lXiUQ2n59tWM7Xn5aFbfAY4sThN-9O2dGlsBKqA/viewform" target="_blank" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Apply</a>
              <a href="https://discord.gg/EpgUyjtZm5" target="_blank" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Join our Discord <i className="fa-brands fa-discord"></i></a>
              <a href="#events" className="px-4 py-2 rounded-xl ring-1 ring-slate-300 hover:bg-white">Upcoming Events</a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {GALLERY.slice(0,4).map((g,i) => (
                  <img key={i} src={g.src} alt="" className="h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                ))}
              </div>
              <span>150+ members · 30+ projects shipped</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl shadow-xl bg-white ring-1 ring-slate-200 overflow-hidden">
              <img src={GALLERY[0].src} alt="Club highlight" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold">What we do</h2>
            <p className="mt-2 text-slate-600">Hands‑on, interdisciplinary, resume‑ready.</p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {[
              { title: "Hack Nights", desc: "Weekly build sessions with mentors and snacks."},
              { title: "Workshops", desc: "Git, product thinking, AI, cloud, and more."},
              { title: "Industry Collabs", desc: "Partner projects with companies and labs."},
              { title: "Showcases", desc: "Demo days to present and get feedback."}
            ].map((c,i) => (
              <div key={i} className="p-6 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events preview */}
      <section id="events" className="py-14 bg-white ring-1 ring-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Recent events</h2>
              <p className="text-slate-600 mt-2">From hackathons to coffee chats with PMs and founders.</p>
            </div>
            <a href="#gallery" className="text-sm underline underline-offset-4">See all photos</a>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[0,1,2].map((i) => (
              <article key={i} className="group overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-slate-50 hover:bg-white transition shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img src={GALLERY[i+1].src} alt={GALLERY[i+1].alt} className="h-full w-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{["Build Night: AI Agents","Speaker: Product x AI","Mini Hackathon Finals"][i]}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{["Rapid prototyping with mentors.","Fireside chat + Q&A.","Top 10 teams demo at Google Canada."][i]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Photos from past events</h2>
          <p className="text-slate-600 mt-2">Tap any photo to view larger. Add more by editing the <code>GALLERY</code> array.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY.map((g, i) => (
              <button key={i} className="relative group focus:outline-none" onClick={() => openLightbox(i)}>
                <img src={g.src} alt={g.alt} className="h-40 md:h-48 w-full object-cover rounded-xl ring-1 ring-slate-200 shadow-sm group-hover:opacity-90"/>
                <span className="sr-only">Open photo {i+1}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-14 bg-white ring-1 ring-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Sponsors & Partners</h2>
          <p className="text-slate-600 mt-2">Thank you to our supporters.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Google","eBay","Walmart","Microsoft"].map((name) => (
              <div key={name} className="h-20 rounded-xl ring-1 ring-slate-200 grid place-items-center bg-slate-50 text-slate-600 font-medium">
                <div className="h-20 w-40 flex items-center justify-center p-4">
                <img
                  src={`/${name.toLowerCase()}-logo.png`}
                  alt={name}
                  className="max-h-12"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.replaceWith(name);
                  }}
                />  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escape Room Registration */}
      <section id="escape-room" className="py-14 bg-slate-50 ring-1 ring-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Escape Room — Registration</h2>
          <p className="text-slate-600 mt-2">Sign up for the Escape Room event.</p>
          <div className="mt-6">
            <a href="#/escape" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Open registration page</a>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section id="join" className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Join Projects Club</h2>
          <p className="text-slate-600 mt-3">
            We welcome builders, designers, and business minds. No experience required—just curiosity and commitment.
          </p>
          <form className="mt-8 grid sm:grid-cols-[1fr_auto] gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Email address" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none" />
            <button type="submit" className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:opacity-90">Get updates</button>
          </form>
          <p className="text-xs text-slate-500 mt-3">Or email us: <a href="mailto:projectsclub@utoronto.ca">projectsclub@utoronto.ca</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Projects Club, University of Toronto</p>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/EpgUyjtZm5" target="_blank">
              <span><i className="fa-brands fa-discord"></i> </span>
              <span className="underline underline-offset-4">Discord</span>
            </a>
            <a href="https://www.instagram.com/ut_projects" target="_blank">
              <span><i className="fa-brands fa-instagram"></i> </span>
              <span className="underline underline-offset-4">Instagram</span>
            </a>
            <a href="https://www.linkedin.com/company/uoft-project-club" target="_blank">
              <span><i className="fa-brands fa-linkedin"></i> </span>
              <span className="underline underline-offset-4">LinkedIn</span>
            </a>
            <a href="mailto:projectsclub@utoronto.ca">
              <span><i className="fa-solid fa-envelope"></i> </span>
              <span className="underline underline-offset-4">Email</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {open && (
        <div role="dialog" aria-modal className="fixed inset-0 z-[60] bg-black/70 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={GALLERY[active].src} alt={GALLERY[active].alt} className="w-full h-auto rounded-2xl shadow-2xl" />
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center">✕</button>
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button aria-label="Prev" onClick={() => setActive((active - 1 + GALLERY.length) % GALLERY.length)} className="h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center">‹</button>
              <button aria-label="Next" onClick={() => setActive((active + 1) % GALLERY.length)} className="h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center">›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


