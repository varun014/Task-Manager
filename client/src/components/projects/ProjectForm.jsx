import { useState } from 'react';
import Button from '../common/Button';

const ProjectForm = ({ onSubmit, submitting = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="project-name">
          Project Name
        </label>
        <input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-semibold text-slate-700"
          htmlFor="project-description"
        >
          Description
        </label>
        <textarea
          id="project-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
};

export default ProjectForm;
