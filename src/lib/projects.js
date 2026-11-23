export const TAG_ORDER = ['Cloud', 'AI/ML', 'Planning', 'Data', 'Web'];

const byOrder = (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

export const teamLabel = (d) => (d.team_size === 1 ? 'Solo' : `Team of ${d.team_size}`);
export const kicker = (d) => [d.course, teamLabel(d)].filter(Boolean).join(' · ');
export const featuredProjects = (entries) => entries.filter((e) => e.data.featured).sort(byOrder);
export const otherProjects = (entries) => entries.filter((e) => !e.data.featured).sort(byOrder);
export const hasDetailPage = (entry) => Boolean(entry.body && entry.body.trim());

export function visibleLinks(d) {
  const { github, ...rest } = d.links ?? {};
  return d.code_public === false || !github ? rest : { ...rest, github };
}

export const filterTags = (entries) => {
  const used = new Set(entries.flatMap((e) => e.data.tags));
  return TAG_ORDER.filter((t) => used.has(t));
};
