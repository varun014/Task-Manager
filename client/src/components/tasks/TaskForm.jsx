import { useMemo, useState } from 'react';
import Button from '../common/Button';
import { priorityOptions, statusOptions } from '../../utils/statusOptions';

const TaskForm = ({ members = [], onSubmit, submitting = false }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: ''
  });

  const assigneeOptions = useMemo(
    () => members.map((member) => ({ value: member.user._id, label: member.user.name })),
    [members]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Medium',
      status: 'To Do',
      dueDate: ''
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="assignedTo">
            Assignee
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
          >
            <option value="">Unassigned</option>
            {assigneeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
          />
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Task'}
      </Button>
    </form>
  );
};

export default TaskForm;
