import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const statusColors = {
  'To Do': '#f97316',
  'In Progress': '#0f766e',
  Done: '#2563eb'
};

const TaskStatusChart = ({ byStatus }) => {
  const data = Object.entries(byStatus || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-ink">Task Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={statusColors[entry.name] || '#64748b'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStatusChart;
