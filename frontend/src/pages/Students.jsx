import { useState } from 'react';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useStudents';
import { usePrograms } from '../hooks/usePrograms';
import StudentFormModal from '../components/StudentFormModal';
import '../styles/DataPage.css';

export default function Students() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('last_name');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: programsData } = usePrograms({ per_page: 100 });
  const programs = programsData?.data ?? [];

  const { data, isLoading, isError, error } = useStudents({
    page,
    search: activeSearch,
    program_id: programFilter || undefined,
    status: statusFilter || undefined,
    sort,
    per_page: 10,
  });

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

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

  function handleFilterChange(setter, value) {
    setter(value);
    setPage(1);
  }

  function handleSortChange(column) {
    setSort((current) => (current === column ? `-${column}` : column));
    setPage(1);
  }

  function handleCreate() {
    setEditingStudent(null);
    setShowForm(true);
  }

  function handleEdit(student) {
    setEditingStudent(student);
    setShowForm(true);
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete student "${student.full_name}"? This cannot be undone.`)) return;
    try {
      await deleteStudent.mutateAsync(student.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  }

  async function handleSubmit(formData) {
    if (editingStudent) {
      await updateStudent.mutateAsync({ id: editingStudent.id, payload: formData });
    } else {
      await createStudent.mutateAsync(formData);
    }
    setShowForm(false);
  }

  function sortIndicator(column) {
    if (sort === column) return ' ▲';
    if (sort === `-${column}`) return ' ▼';
    return '';
  }

  if (isLoading) return <div className="state-message">Loading students...</div>;
  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load students: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const students = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Students</h1>
        <button className="btn-primary" onClick={handleCreate}>+ New Student</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or student number..."
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

      <div className="filter-bar">
        <select
          value={programFilter}
          onChange={(e) => handleFilterChange(setProgramFilter, e.target.value)}
        >
          <option value="">All Programs</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>{program.code}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      {students.length === 0 ? (
        <div className="state-message">No students found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSortChange('student_number')} className="sortable">
                Student No.{sortIndicator('student_number')}
              </th>
              <th onClick={() => handleSortChange('last_name')} className="sortable">
                Name{sortIndicator('last_name')}
              </th>
              <th>Program</th>
              <th onClick={() => handleSortChange('year_level')} className="sortable">
                Year Level{sortIndicator('year_level')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.student_number}</td>
                <td>{student.full_name}</td>
                <td>{student.program?.code ?? '—'}</td>
                <td>{student.year_level}</td>
                <td><span className={`badge badge-${student.status === 'active' ? 'active' : 'inactive'}`}>{student.status}</span></td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {meta.current_page} of {meta.last_page} ({meta.total} total)</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {showForm && (
        <StudentFormModal student={editingStudent} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}