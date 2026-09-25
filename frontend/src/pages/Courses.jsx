import { useState } from 'react';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourses';
import CourseFormModal from '../components/CourseFormModal';
import '../styles/DataPage.css';

export default function Courses() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useCourses({ page, search: activeSearch, per_page: 10 });
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  function handleSearch() {
    setPage(1);
    setActiveSearch(searchInput);
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleClearSearch() {
    setSearchInput('');
    setActiveSearch('');
    setPage(1);
  }

  function handleCreate() {
    setEditingCourse(null);
    setShowForm(true);
  }

  function handleEdit(course) {
    setEditingCourse(course);
    setShowForm(true);
  }

  async function handleDelete(course) {
    if (!window.confirm(`Delete course "${course.course_title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse.mutateAsync(course.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course.');
    }
  }

  async function handleSubmit(formData) {
    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, payload: formData });
    } else {
      await createCourse.mutateAsync(formData);
    }
    setShowForm(false);
  }

  if (isLoading) return <div className="state-message">Loading courses...</div>;
  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load courses: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const courses = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Courses</h1>
        <button className="btn-primary" onClick={handleCreate}>+ New Course</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-secondary">Search</button>
        {activeSearch && (
          <button onClick={handleClearSearch} className="btn-secondary">Clear</button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="state-message">No courses found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Units</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.course_code}</td>
                <td>{course.course_title}</td>
                <td>{course.units}</td>
                <td><span className={`badge badge-${course.status}`}>{course.status}</span></td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(course)}>Edit</button>
                  <button onClick={() => handleDelete(course)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {meta.current_page} of {meta.last_page}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {showForm && (
        <CourseFormModal course={editingCourse} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}