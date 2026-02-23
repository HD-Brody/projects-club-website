import { useState, useEffect } from "react";
import { projectApi } from "../utils/api";
import ProjectCard from "./ProjectCard";

interface ProjectData {
  id: number;
  title: string;
  description: string | null;
  skills: string | null;
  category: string | null;
  role: "Owner" | "Member";
}

interface ProjectsSectionProps {
  userId?: number;
}

export default function ProjectsSection({ userId }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        if (userId !== undefined) {
          // Public view: fetch user's projects via public endpoint
          const res = await projectApi.getUserProjects(userId);
          if (res.data && Array.isArray(res.data)) {
            setProjects(
              res.data.map((p: any) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                skills: p.skills,
                category: p.category,
                role: p.role || "Owner",
              }))
            );
          }
        } else {
          // Own profile: fetch owned + member projects
          const [ownedRes, appsRes] = await Promise.all([
            projectApi.getMyProjects(),
            projectApi.getMyApplications(),
          ]);

        const combined: ProjectData[] = [];

        // Add owned projects
        if (ownedRes.data && Array.isArray(ownedRes.data)) {
          for (const p of ownedRes.data) {
            combined.push({
              id: p.id,
              title: p.title,
              description: p.description,
              skills: p.skills,
              category: p.category,
              role: "Owner",
            });
          }
        }

        // Add projects where user is accepted member
        if (appsRes.data && Array.isArray(appsRes.data)) {
          const ownedIds = new Set(combined.map((p) => p.id));
          for (const app of appsRes.data) {
            if (
              app.status === "accepted" &&
              app.project &&
              !ownedIds.has(app.project.id)
            ) {
              combined.push({
                id: app.project.id,
                title: app.project.title,
                description: null,
                skills: null,
                category: app.project.category,
                role: "Member",
              });
            }
          }
        }

        setProjects(combined);
        }
      } catch {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  return (
    <section className="bg-white rounded-2xl ring-1 ring-slate-200 p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Projects
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 text-center py-6">{error}</p>
      ) : projects.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-10 w-10 rounded-lg bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center mb-3">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-17.5 0h17.5m-17.5 0V18a2.25 2.25 0 002.25 2.25h13a2.25 2.25 0 002.25-2.25v-5.25"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-500 mb-3">No projects yet.</p>
          <a
            href="#/submit-project"
            className="px-4 py-1.5 rounded-lg ring-1 ring-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Create Project
          </a>
        </div>
      ) : (
        /* ── Horizontal scroll list ── */
        <div className="group/scroll relative -mx-1">
          <div
            className="flex gap-3 overflow-x-auto px-1 pt-1 pb-2 scrollbar-thin"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.scrollbarColor = "#cbd5e1 transparent";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.scrollbarColor = "transparent transparent";
            }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={`${project.role}-${project.id}`}
                id={project.id}
                title={project.title}
                description={project.description}
                category={project.category}
                skills={project.skills}
                role={project.role}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
