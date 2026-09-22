import { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useAcademicTerms } from '../hooks/useAcademicTerms';
import { useUsers } from '../hooks/useUsers';
import Combobox from './Combobox';
import '../styles/Modal.css';

export default function CourseOfferingFormModal({ offering, onSubmit, onClose }) {
  const { data: coursesData } = useCourses({ per_page: 100 });
  const { data: termsData } = useAcademicTerms({ per_page: 100 });
  const { data: instructors = [] } = useUsers({ role: 'instructor' });

  const courses = coursesData?.data ?? [];
  const terms = termsData?.data ?? [];

  const [formData, setFormData] = useState({
    course_id: offering?.course_id || '',
    academic_term_id: offering?.academic_term_id || '',
    instructor_id: offering?.instructor_id || '',
    section: offering?.section || '',
    schedule: offering?.schedule || '',
    room: offering?.room || '',
    capacity: offering?.capacity || 30,
    status: offering?.status || 'open',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'capacity' ? Number(value) : value });
  }

  function handleComboboxChange(field, value) {
    setFormData({ ...formData, [field]: value });
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
        <h2>{offering ? 'Edit Course Offering' : 'New Course Offering'}</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Course
            <Combobox
              options={courses}
              value={formData.course_id}
              onChange={(id) => handleComboboxChange('course_id', id)}
              placeholder="Search course by code or title..."
              getLabel={(course) => `${course.course_code} — ${course.course_title}`}
              getValue={(course) => course.id}
            />
            {errors.course_id && <span className="field-error">{errors.course_id[0]}</span>}
          </label>

          <label>
            Academic Term
            <Combobox
              options={terms}
              value={formData.academic_term_id}
              onChange={(id) => handleComboboxChange('academic_term_id', id)}
              placeholder="Search academic term..."
              getLabel={(term) => `${term.academic_year} — ${term.semester}`}
              getValue={(term) => term.id}
            />
            {errors.academic_term_id && <span className="field-error">{errors.academic_term_id[0]}</span>}
          </label>

          <label>
            Instructor
            <Combobox
              options={instructors}
              value={formData.instructor_id}
              onChange={(id) => handleComboboxChange('instructor_id', id)}
              placeholder="Search instructor by name..."
              getLabel={(user) => `${user.name} (${user.email})`}
              getValue={(user) => user.id}
            />
            {errors.instructor_id && <span className="field-error">{errors.instructor_id[0]}</span>}
          </label>

          <label>
            Section
            <input name="section" value={formData.section} onChange={handleChange} required />
            {errors.section && <span className="field-error">{errors.section[0]}</span>}
          </label>

          <label>
            Schedule
            <input name="schedule" placeholder="e.g. MWF 9:00-10:00" value={formData.schedule} onChange={handleChange} />
          </label>

          <label>
            Room
            <input name="room" value={formData.room} onChange={handleChange} />
          </label>

          <label>
            Capacity
            <input type="number" name="capacity" min="1" max="200" value={formData.capacity} onChange={handleChange} required />
            {errors.capacity && <span className="field-error">{errors.capacity[0]}</span>}
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
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