import { useState } from 'react';
import '../styles/Modal.css';

export default function AcademicTermFormModal({ term, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    academic_year: term?.academic_year || '',
    semester: term?.semester || '1st Semester',
    start_date: term?.start_date || '',
    end_date: term?.end_date || '',
    status: term?.status || 'upcoming',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err.isNetworkError) {
        setErrors({ _general: err.friendlyMessage });
      } else if (err.response?.status === 422) {
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
        <h2>{term ? 'Edit Academic Term' : 'New Academic Term'}</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Academic Year
            <input
              name="academic_year"
              placeholder="e.g. 2026-2027"
              value={formData.academic_year}
              onChange={handleChange}
              required
            />
            {errors.academic_year && <span className="field-error">{errors.academic_year[0]}</span>}
          </label>

          <label>
            Semester
            <select name="semester" value={formData.semester} onChange={handleChange}>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
            {errors.semester && <span className="field-error">{errors.semester[0]}</span>}
          </label>

          <label>
            Start Date
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
            {errors.start_date && <span className="field-error">{errors.start_date[0]}</span>}
          </label>

          <label>
            End Date
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
            {errors.end_date && <span className="field-error">{errors.end_date[0]}</span>}
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
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