import { useState, useEffect } from "react";

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
  
  useEffect(() => {
    document.title = "Projects Club — University of Toronto";
  }, []);

  const openLightbox = (i: number) => {
    setActive(i);
    setOpen(true);
  };

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
          </nav>
        </div>
      </header>

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
          <h2 className="text-2xl font-bold">Escape Room — Team Registration</h2>
          <div className="mt-6">
            <RegistrationForm />
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

// RegistrationForm component collects team registration data and POSTs to a spreadsheet/webhook.
function RegistrationForm() {
  // Replace with deployed Apps Script web app URL or other form endpoint
  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbz8OCbGLQCmKqq4TCGGrp0jmsfhxXiYv05Zemw1FQIgE5S60PCqsJCzAar0Nv_wXtuMEA/exec";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [program, setProgram] = useState("");
  const [submitterYear, setSubmitterYear] = useState("");
  const [email, setEmail] = useState("");
  const [signupType, setSignupType] = useState<"individual" | "team">("team");
  // Enforce exactly 4 teammates (plus submitter = 5 total)
  const [teammates, setTeammates] = useState<Array<{ name: string; email: string; major?: string; year?: string }>>([
    { name: "", email: "", major: "", year: "" },
    { name: "", email: "", major: "", year: "" },
    { name: "", email: "", major: "", year: "" },
    { name: "", email: "", major: "", year: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // No dynamic add/remove: teams must have exactly 5 members (submitter + 4 teammates)
  const addTeammate = () => {};
  const removeTeammate = (_i: number) => {};
  const updateTeammate = (i: number, key: "name" | "email" | "major" | "year", value: string) => {
    const copy = teammates.slice();
    copy[i] = { ...copy[i], [key]: value };
    setTeammates(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    // require submitter fields
    if (!firstName.trim() || !lastName.trim() || !program.trim() || !email.trim() || !submitterYear.trim()) {
      setMessage("Please fill required fields for the submitter (including year).");
      return;
    }
    // If signing up as a team, require teammate details (exactly 4 teammates required)
    if (signupType === "team") {
      for (let i = 0; i < teammates.length; i++) {
        const tm = teammates[i];
        if (!tm.name.trim() || !tm.email.trim() || !tm.major?.trim() || !tm.year?.trim()) {
          setMessage(`Please fill name, UofT email, major, and year for teammate ${i + 1}. All 4 teammates are required.`);
          return;
        }
      }
    }
    setSubmitting(true);
    const payload: any = {
      signupType,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      program: program.trim(),
      submitterYear: submitterYear.trim(),
      email: email.trim()
    };
    if (signupType === "team") {
      payload.teammates = teammates.map((t) => ({ name: t.name.trim(), email: t.email.trim(), major: (t.major||"").trim(), year: (t.year||"").trim() }));
    } else {
      payload.teammates = [];
    }

    try {
      const res = await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        // use a simple content type to avoid CORS preflight (some Apps Script deployments
        // don't respond to OPTIONS). Apps Script can still read the body via e.postData.contents.
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === true || res.status === 200)) {
        setMessage("Registration submitted - thank you! Each team should submit only one form.");
        // clear form
        setFirstName("");
        setLastName("");
        setProgram("");
        setSubmitterYear("");
        setEmail("");
        setTeammates([
          { name: "", email: "", major: "", year: "" },
          { name: "", email: "", major: "", year: "" },
          { name: "", email: "", major: "", year: "" },
          { name: "", email: "", major: "", year: "" }
        ]);
      } else {
        setMessage((data && data.error) ? `Failed: ${String(data.error)}` : "Failed to submit — try again or contact projectsclub@utoronto.ca");
      }
    } catch (err) {
      setMessage("Network error — try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2 items-center">
        <label className="flex items-center gap-2">
          <input type="radio" name="signupType" value="individual" checked={signupType === "individual"} onChange={() => setSignupType("individual")} />
          <span className="text-sm">Signing up individually</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="signupType" value="team" checked={signupType === "team"} onChange={() => setSignupType("team")} />
          <span className="text-sm">Signing up as a team</span>
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
        <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <input required value={program} onChange={(e) => setProgram(e.target.value)} placeholder="Program (e.g., CS, Rotman Commerce)" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
        <input required value={submitterYear} onChange={(e) => setSubmitterYear(e.target.value)} placeholder="Year (e.g., 1, 2, 3)" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="UofT email (you@utoronto.ca)" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
      </div>

      {signupType === "team" && (
        <div>
          <h3 className="font-medium">Teammates (required)</h3>
          <p className="text-xs text-slate-500 mb-2">This event requires exactly 5-person teams: the submitter plus 4 teammates. Please provide the full name, UofT email, major, and year for each teammate.</p>
          <div className="space-y-3">
            {teammates.map((t, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <input required value={t.name} onChange={(e) => updateTeammate(i, "name", e.target.value)} placeholder={`Teammate ${i + 1} name`} className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none min-w-0" />
                <input required value={t.email} onChange={(e) => updateTeammate(i, "email", e.target.value)} placeholder={`UofT email`} className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none min-w-0" />
                <input required value={t.major} onChange={(e) => updateTeammate(i, "major", e.target.value)} placeholder="Major" className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none min-w-0" />
                <input required value={t.year} onChange={(e) => updateTeammate(i, "year", e.target.value)} placeholder="Year" className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none min-w-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
          {submitting ? "Submitting..." : "Submit registration"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </form>
  );
}
