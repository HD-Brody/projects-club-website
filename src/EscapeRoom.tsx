import { useState } from "react";

export default function EscapeRoomPage() {
  // Replace with deployed Apps Script web app URL or other form endpoint
  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbx9NJt_al_Ki73Rr9Kuq0Y0jGkXkfXY7GdqA2OthW_9m7nLJXrzZYGxZqTyr3w_H218Cg/exec";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [program, setProgram] = useState("");
  const [submitterYear, setSubmitterYear] = useState("");
  const [email, setEmail] = useState("");
  const [signupType, setSignupType] = useState<"individual" | "team">("team");
  const [teammates, setTeammates] = useState<Array<{ name: string; email: string; major?: string; year?: string }>>([
    { name: "", email: "", major: "", year: "" },
    { name: "", email: "", major: "", year: "" },
    { name: "", email: "", major: "", year: "" },
    { name: "", email: "", major: "", year: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateTeammate = (i: number, key: "name" | "email" | "major" | "year", value: string) => {
    const copy = teammates.slice();
    copy[i] = { ...copy[i], [key]: value };
    setTeammates(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!firstName.trim() || !lastName.trim() || !program.trim() || !email.trim() || !submitterYear.trim()) {
      setMessage("Please fill required fields for the submitter (including year).");
      return;
    }
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
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === true || res.status === 200)) {
        setMessage("Registration submitted!");
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
    // center the page vertically so toggling fields doesn't move the hero out of center
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20 lg:px-8 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Poster-inspired hero */}
        <div className="relative flex items-center justify-center">
          <div className="w-full text-center">
            <div className="mx-auto mb-6 w-36 h-36 rounded-full bg-white grid place-items-center shadow-2xl" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
              <div className="text-4xl">🔐</div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">The<br/>Escape Room</h1>
            <p className="mt-4 text-xl text-amber-300">Case Challenge + Panel Talk</p>
            <p className="mt-6 text-slate-300 max-w-lg mx-auto">Presented by <span className="font-semibold text-amber-400">UTPC</span> — bring your problem solving A-game. Register as a team (5 people) or individually.</p>
          </div>

          {/* decorative dotted circles */}
          <div className="pointer-events-none absolute -left-20 top-6 w-48 h-48 rounded-full bg-gradient-to-tr from-violet-600 to-transparent opacity-20 blur-sm" />
          <div className="pointer-events-none absolute -right-28 bottom-8 w-56 h-56 rounded-full bg-gradient-to-tr from-green-500 to-transparent opacity-20 blur-sm" />
        </div>

        {/* Right: Form card */}
        <div>
          <div className="mx-auto max-w-xl bg-gradient-to-b from-white/5 to-white/3 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
            <button onClick={() => { window.location.hash = ''; }} className="mb-4 text-sm text-slate-300 hover:underline">← Back to home</button>
            <h2 className="text-2xl font-bold mb-1">Register for Escape Room</h2>
            <p className="text-sm text-slate-400 mb-6">Sign up individually or as a team. Teams must be exactly 5 people (submitter + 4 teammates). Each team should submit only one form.</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="px-4 py-3 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="px-4 py-3 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <input required value={program} onChange={(e) => setProgram(e.target.value)} placeholder="Program (e.g., CS)" className="px-4 py-3 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                <input required value={submitterYear} onChange={(e) => setSubmitterYear(e.target.value)} placeholder="Year (e.g., 1)" className="px-4 py-3 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="UofT email" className="px-4 py-3 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 items-center">
                <label className="flex items-center gap-2">
                  <input type="radio" name="signupType" value="individual" checked={signupType === "individual"} onChange={() => setSignupType("individual")} />
                  <span className="text-sm">Individual</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="signupType" value="team" checked={signupType === "team"} onChange={() => setSignupType("team")} />
                  <span className="text-sm">Team (5 people)</span>
                </label>
              </div>

              {signupType === "team" && (
                <div>
                  <h3 className="font-medium">Teammates (4 required)</h3>
                  <p className="text-xs text-slate-400 mb-2">Provide name, email, major, and year for each teammate.</p>
                  <div className="space-y-3">
                    {teammates.map((t, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        <input required value={t.name} onChange={(e) => updateTeammate(i, "name", e.target.value)} placeholder={`Teammate ${i + 1}`} className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                        <input required value={t.email} onChange={(e) => updateTeammate(i, "email", e.target.value)} placeholder={`UofT email`} className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                        <input required value={t.major} onChange={(e) => updateTeammate(i, "major", e.target.value)} placeholder="Major" className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                        <input required value={t.year} onChange={(e) => updateTeammate(i, "year", e.target.value)} placeholder="Year" className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 placeholder:text-slate-400 outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <a href="https://www.eventbrite.com/e/utpc-escape-case-challenge-panel-talk-tickets-1860977276129?aff=oddtdtcreator" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-lg bg-amber-500 text-black font-semibold hover:opacity-90">Get tickets</a>
                <button type="submit" disabled={submitting} className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-amber-400 text-black font-bold shadow-lg hover:scale-105 transform transition">{submitting ? "Submitting..." : "Submit registration"}</button>
                {message && <p className="text-sm text-slate-300">{message}</p>}
              </div>

              <p className="mt-3 text-xs text-amber-300">Your spot will only be confirmed after payment.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
