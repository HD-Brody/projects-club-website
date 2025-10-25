import { useState } from "react";

export default function EscapeRoomPage() {
  // Replace with deployed Apps Script web app URL or other form endpoint
  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbx_CKodPhSHBIBZHYBfillBu2F45a3t7XD0sV_HGSggxvnUeI5R3wY5d_j9v9VRUKWU5A/exec";

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
        setMessage("Registration submitted - thank you! Each team should submit only one form.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 p-8">
      <div className="mx-auto max-w-3xl bg-white p-8 rounded-2xl shadow ring-1 ring-slate-200">
        <button onClick={() => { window.location.hash = ''; }} className="mb-4 text-sm underline">← Back to home</button>
        <h1 className="text-2xl font-bold mb-2">Escape Room — Registration</h1>
        <p className="text-slate-600 mb-4">Sign up individually or as a team. Teams must be exactly 5 people (submitter + 4 teammates). Each team should submit only once.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
            <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <input required value={program} onChange={(e) => setProgram(e.target.value)} placeholder="Program (e.g., CS, Rotman Commerce)" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
            <input required value={submitterYear} onChange={(e) => setSubmitterYear(e.target.value)} placeholder="Year (e.g., 1, 2, 3)" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="UofT email (you@utoronto.ca)" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white outline-none" />
          </div>

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

          {signupType === "team" && (
            <div>
              <h3 className="font-medium">Teammates (required)</h3>
              <p className="text-xs text-slate-500 mb-2">Provide name, UofT email, major, and year for each teammate.</p>
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
            <a href="https://www.eventbrite.com/e/utpc-escape-case-challenge-panel-talk-tickets-1860977276129?aff=oddtdtcreator" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-xl bg-amber-500 text-white hover:opacity-90">Get tickets</a>

            <button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
              {submitting ? "Submitting..." : "Submit registration"}
            </button>
            {message && <p className="text-sm text-slate-600">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
