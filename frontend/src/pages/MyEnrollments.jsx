import { useMyEnrollments } from '../hooks/useMyRecord';
import '../styles/DataPage.css';

export default function MyEnrollments() {
  const { data, isLoading, isError, error } = useMyEnrollments();

  if (isLoading) return <div className="state-message">Loading your enrollments...</div>;
  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load your enrollments: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const enrollments = data?.data ?? [];

  return (
    <div className="data-page">
      <h1>My Enrollments</h1>

      {enrollments.length === 0 ? (
        <div className="state-message">You have no enrollments yet.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Section</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>{enrollment.course_offering?.course?.course_code} — {enrollment.course_offering?.course?.course_title}</td>
                  <td>{enrollment.course_offering?.section}</td>
                  <td>{enrollment.enrollment_date}</td>
                  <td><span className={`badge badge-${enrollment.status === 'enrolled' ? 'active' : 'inactive'}`}>{enrollment.status}</span></td>
                  <td>
                    {enrollment.grade
                      ? `Midterm: ${enrollment.grade.midterm_grade ?? '—'} / Final: ${enrollment.grade.final_grade ?? '—'}`
                      : 'Not graded yet'}
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