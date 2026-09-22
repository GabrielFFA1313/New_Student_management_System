import { useState } from 'react';
import { usePrograms } from '../hooks/usePrograms';
import '../styles/Modal.css';

export default function StudentFormModal({ student, onSubmit, onClose }) {
  const { data: programsData, isLoading: programsLoading } = usePrograms({ per_page: 100 });
  const programs = programsData?.data ?? [];

  const [formData, setFormData] = useState({
    student_number: student?.student_number || '',
    first_name: student?.first_name || '',
    middle_name: student?.middle_name || '',
    last_name: student?.last_name || '',
    email: student?.email || '',
    contact_number: student?.contact_number || '',
    program_id: student?.program_id || '',
    year_level: student?.year_level || 1,
    status: student?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'program_id' || name === 'year_level' ? Number(value) : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ _general: err.response?.data?.message || 'Something went wrong.' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{student ? 'Edit Student' : 'New Student'}</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Student Number
            <input name="student_number" value={formData.student_number} onChange={handleChange} required />
            {errors.student_number && <span className="field-error">{errors.student_number[0]}</span>}
          </label>

          <label>
            First Name
            <input name="first_name" value={formData.first_name} onChange={handleChange} required />
            {errors.first_name && <span className="field-error">{errors.first_name[0]}</span>}
          </label>

          <label>
            Middle Name
            <input name="middle_name" value={formData.middle_name} onChange={handleChange} />
          </label>

          <label>
            Last Name
            <input name="last_name" value={formData.last_name} onChange={handleChange} required />
            {errors.last_name && <span className="field-error">{errors.last_name[0]}</span>}
          </label>

          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email[0]}</span>}
          </label>

          <label>
            Contact Number
            <input name="contact_number" value={formData.contact_number} onChange={handleChange} />
          </label>

          <label>
            Program
            {programsLoading ? (
              <span>Loading programs...</span>
            ) : (
              <select name="program_id" value={formData.program_id} onChange={handleChange} required>
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.code} — {program.name}
                  </option>
                ))}
              </select>
            )}
            {errors.program_id && <span className="field-error">{errors.program_id[0]}</span>}
          </label>

          <label>
            Year Level
            <select name="year_level" value={formData.year_level} onChange={handleChange}>
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="dropped">Dropped</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}