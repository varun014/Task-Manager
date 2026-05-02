import Button from '../common/Button';

const MemberList = ({ members = [], isAdmin = false, onRemove }) => {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-ink">Project Members</h3>
      <ul className="space-y-3">
        {members.map((member) => (
          <li
            key={member.user._id}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
          >
            <div>
              <p className="font-semibold text-ink">{member.user.name}</p>
              <p className="text-sm text-slate-500">
                {member.user.email} - {member.role}
              </p>
            </div>

            {isAdmin && member.role !== 'Admin' ? (
              <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => onRemove(member.user._id)}>
                Remove
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
