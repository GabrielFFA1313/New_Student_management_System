import { useMyGrades } from '../hooks/useMyRecord';
import '../styles/DataPage.css';

export default function MyGrades() {
  const { data, isLoading, isError, error } = useMyGrades();

  if (isLoading) return <div className="state-message">Loading your grades...</div>;
  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load your grades: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const grades = data?.data ?? [];

  return (
    <div className="data-page">
      <h1>My Grades</h1>

      {grades.length === 0 ? (
        <div className="state-message">No grades recorded yet.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Midterm</th>
                <th>Final</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.enrollment?.courseOffering?.course?.course_code ?? '—'}</td>
                  <td>{grade.midterm_grade ?? '—'}</td>
                  <td>{grade.final_grade ?? '—'}</td>
                  <td>
                    {grade.remarks ? (
                      <span className={`badge badge-${grade.remarks === 'passed' ? 'active' : 'inactive'}`}>{grade.remarks}</span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}