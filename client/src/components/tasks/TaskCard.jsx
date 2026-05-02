import { Link } from 'react-router-dom';
import priorityColors from '../../utils/priorityColors';
import formatDate from '../../utils/formatDate';
import Badge from '../common/Badge';
import TaskStatusBadge from './TaskStatusBadge';

const TaskCard = ({ task }) => {
  return (
    <Link
      to={`/projects/${task.project?._id || task.project}/tasks/${task._id}`}
      className="block rounded-2xl border border-teal-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-base font-semibold text-ink">{task.title}</h4>
        <TaskStatusBadge status={task.status} />
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{task.description || 'No description'}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className={priorityColors[task.priority] || 'bg-slate-100 text-slate-600'}>
          {task.priority}
        </Badge>
        <Badge className="bg-slate-100 text-slate-600">Due: {formatDate(task.dueDate)}</Badge>
        {task.assignedTo ? (
          <Badge className="bg-cyan-100 text-cyan-700">Assignee: {task.assignedTo.name}</Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-600">Unassigned</Badge>
        )}
      </div>
    </Link>
  );
};

export default TaskCard;
