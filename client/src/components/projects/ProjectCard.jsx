import { Link } from 'react-router-dom';
import Button from '../common/Button';

const ProjectCard = ({ project, isAdmin, onDelete }) => {
  return (
    <article className="rounded-2xl border border-teal-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5">
      <h3 className="text-xl font-bold text-ink">{project.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description || 'No description'}</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {project.members?.length || 0} members
        </p>
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project._id}`}
            className="rounded-xl border border-teal-200 px-3 py-2 text-sm font-semibold text-sea hover:bg-teal-50"
          >
            Open
          </Link>
          {isAdmin ? (
            <Button variant="danger" className="px-3 py-2 text-sm" onClick={() => onDelete(project._id)}>
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
