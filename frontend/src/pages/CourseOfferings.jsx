import { useState } from 'react';
import {
  useCourseOfferings,
  useCreateCourseOffering,
  useUpdateCourseOffering,
  useDeleteCourseOffering,
} from '../hooks/useCourseOfferings';
import { useCourses } from '../hooks/useCourses';
import { useAcademicTerms } from '../hooks/useAcademicTerms';
import CourseOfferingFormModal from '../components/CourseOfferingFormModal';
import '../styles/DataPage.css';

export default function CourseOfferings() {
  const [page, setPage] = useState(1);
  const [courseFilter, setCourseFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingOffering, setEditingOffering] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: coursesData } = useCourses({ per_page: 100 });
  const { data: termsData } = useAcademicTerms({ per_page: 100 });
  const courses = coursesData?.data ?? [];
  const terms = termsData?.data ?? [];

  const { data, isLoading, isError, error } = useCourseOfferings({
    page,
    course_id: courseFilter || undefined,
    academic_term_id: termFilter || undefined,
    status: statusFilter || undefined,
    per_page: 10,
  });

  const createOffering = useCreateCourseOffering();
  const updateOffering = useUpdateCourseOffering();
  const deleteOffering = useDeleteCourseOffering();

  function handleFilterChange(setter, value) {
    setter(value);
    setPage(1);
  }

  function handleCreate() {
    setEditingOffering(null);
    setShowForm(true);
  }

  function handleEdit(offering) {
    setEditingOffering(offering);
    setShowForm(true);
  }

  async function handleDelete(offering) {
    if (!window.confirm(`Delete section "${offering.section}" of ${offering.course?.course_code}? This cannot be undone.`)) return;
    try {
      await deleteOffering.mutateAsync(offering.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course offering.');
    }
  }

  async function handleSubmit(formData) {
    if (editingOffering) {
      await updateOffering.mutateAsync({ id: editingOffering.id, payload: formData });
    } else {
      await createOffering.mutateAsync(formData);
    }
    setShowForm(false);
  }

  if (isLoading) return <div className="state-message">Loading course offerings...</div>;
  if (isError) {
    return (
      <div className="state-message error">
        Failed to load course offerings: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const offerings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Course Offerings</h1>
        <button className="btn-primary" onClick={handleCreate}>+ New Course Offering</button>
      </div>

      <div className="filter-bar">
        <select value={courseFilter} onChange={(e) => handleFilterChange(setCourseFilter, e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.course_code}</option>
          ))}
        </select>

        <select value={termFilter} onChange={(e) => handleFilterChange(setTermFilter, e.target.value)}>
          <option value="">All Terms</option>
          {terms.map((term) => (
            <option key={term.id} value={term.id}>{term.academic_year} — {term.semester}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {offerings.length === 0 ? (
        <div className="state-message">No course offerings found.</div>
      ) : (
        <div className="table-scroll">
        <table className="data-table">
          <thead>
          <tr>
            <th>Course</th>
            <th>Section</th>
            <th>Term</th>
            <th>Schedule</th>
            <th>Room</th>
            <th>Instructor</th>
            <th>Enrolled</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
          <tbody>
            {offerings.map((offering) => (
              <tr key={offering.id}>
                <td>{offering.course?.course_code} — {offering.course?.course_title}</td>
                <td>{offering.section}</td>
                <td>{offering.academic_term?.academic_year} {offering.academic_term?.semester}</td>
                <td>{offering.schedule || '—'}</td>
                <td>{offering.room || '—'}</td>
                <td>{offering.instructor?.name ?? '—'}</td>
                <td>{offering.enrolled_count ?? 0} / {offering.capacity}</td>
                <td><span className={`badge badge-${offering.status === 'open' ? 'active' : 'inactive'}`}>{offering.status}</span></td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(offering)}>Edit</button>
                  <button onClick={() => handleDelete(offering)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {meta.current_page} of {meta.last_page}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {showForm && (
        <CourseOfferingFormModal
          offering={editingOffering}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}