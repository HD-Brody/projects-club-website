interface ProjectCardProps {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  skills: string | null;
  role: "Owner" | "Member";
}

export default function ProjectCard({
  id,
  title,
  description,
  category,
  skills,
  role,
}: ProjectCardProps) {
  const tags = skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <a
      href={`#/projects`}
      className="group block w-64 shrink-0 rounded-lg bg-white ring-1 ring-slate-200 p-4 shadow-sm hover:shadow-md hover:ring-slate-300 transition-all"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-700 transition-colors">
          {title}
        </h3>
        <span
          className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
            role === "Owner"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
          }`}
        >
          {role}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
        {description?.trim() || "No description provided."}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-slate-50 ring-1 ring-slate-200 text-[10px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] text-slate-400">
              +{tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Category footer */}
      {category && (
        <p className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {category}
        </p>
      )}
    </a>
  );
}
