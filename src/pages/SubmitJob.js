import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function SubmitJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    property_name: '',
    address: '',
    phone: '',
    email: '',
    management_company: '',
    owner_name: '',
    description: '',
    level: 'standard',
    scheduled_date: '',
    guest_present: 'no',
    next_checkin_time: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('jobs').insert([
      {
        title: `${form.property_name} - ${form.description.slice(0, 30)}`,
        description: `
        Issue: ${form.description}
        Guest Present: ${form.guest_present}
        Next Check-in: ${form.next_checkin_time}
        Owner: ${form.owner_name}
        Management Company: ${form.management_company}
        Phone: ${form.phone}
        Email: ${form.email}
        Address: ${form.address}
        `,
        level: form.level,
        scheduled_date: form.scheduled_date || null,
        status: 'pending',
        // tech_id can be null for now
      },
    ]);

    if (error) {
      alert('Error submitting job: ' + error.message);
    } else {
      alert('Job submitted!');
      navigate('/client-dashboard');
    }

    setSubmitting(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📬 Submit New Job</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
        <input name="property_name" placeholder="Cabin / Property Name" value={form.property_name} onChange={handleChange} required />
        <input name="address" placeholder="Service Address" value={form.address} onChange={handleChange} required />
        <input name="phone" placeholder="Phone (for updates)" value={form.phone} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
        <input name="management_company" placeholder="Property Management Company" value={form.management_company} onChange={handleChange} />
        <input name="owner_name" placeholder="Owner's Name (for warranty)" value={form.owner_name} onChange={handleChange} />

        <textarea name="description" placeholder="Describe the problem in detail" value={form.description} onChange={handleChange} required rows={4} />

        <select name="level" value={form.level} onChange={handleChange}>
          <option value="standard">Standard</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>

        <label>
          Preferred Service Date:
          <input name="scheduled_date" type="date" value={form.scheduled_date} onChange={handleChange} />
        </label>

        <label>
          Guest Present?
          <select name="guest_present" value={form.guest_present} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <input name="next_checkin_time" type="datetime-local" value={form.next_checkin_time} onChange={handleChange} placeholder="Next Check-in Time" />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Job'}
        </button>
      </form>
    </div>
  );
}
