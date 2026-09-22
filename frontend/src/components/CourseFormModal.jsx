import { useState } from 'react';
import '../styles/Modal.css';

export default function CourseFormModal({ course, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    course_code: course?.course_code || '',
    course_title: course?.course_title || '',
    description: course?.description || '',
    units: course?.units || 3,
    status: course?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'units' ? Number(value) : value });
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
        <h2>{course ? 'Edit Course' : 'New Course'}</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Course Code
            <input name="course_code" value={formData.course_code} onChange={handleChange} required />
            {errors.course_code && <span className="field-error">{errors.course_code[0]}</span>}
          </label>

          <label>
            Course Title
            <input name="course_title" value={formData.course_title} onChange={handleChange} required />
            {errors.course_title && <span className="field-error">{errors.course_title[0]}</span>}
          </label>

          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>
            Units
            <input type="number" name="units" min="1" max="10" value={formData.units} onChange={handleChange} required />
            {errors.units && <span className="field-error">{errors.units[0]}</span>}
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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