import Badge from '../common/Badge';

const styles = {
  'To Do': 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-teal-100 text-teal-700',
  Done: 'bg-blue-100 text-blue-700'
};

const TaskStatusBadge = ({ status }) => {
  return <Badge className={styles[status] || 'bg-slate-100 text-slate-700'}>{status}</Badge>;
};

export default TaskStatusBadge;
