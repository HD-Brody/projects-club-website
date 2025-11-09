import React from "react";

function Footer() {
  return (
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
  );
}

export default React.memo(Footer);
