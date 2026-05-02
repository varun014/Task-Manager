import { Link } from 'react-router-dom';

const Sidebar = ({ projects = [], title = 'Your Projects' }) => {
  return (
    <aside className="hidden w-72 shrink-0 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm lg:block">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="space-y-2">
        {projects.length ? (
          projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
            >
              {project.name}
            </Link>
          ))
        ) : (
          <p className="text-sm text-slate-500">No projects yet.</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
