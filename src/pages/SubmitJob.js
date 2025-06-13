// src/pages/SubmitJob.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SubmitJob = () => {
  const [form, setForm] = useState({
    propertyName: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    propertyManagementCompany: '',
    ownerName: '',
    description: '',
    guestPresent: false,
    nextCheckIn: '',
    serviceRequestedBy: '',
    emergency: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const [form, setForm] = useState({
  title: '',
  description: '',
  region: '', // ✅ add this
  // ... other fields
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate backend submission
    toast.success('✅ Job submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">📤 Submit a New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

    <label className="block mb-2 text-sm font-medium text-gray-700">Region</label>
<select
  name="region"
  value={form.region}
  onChange={handleChange}
  required
  className="w-full border p-2 rounded mb-4"
>
  <option value="">Select Region</option>
  <option value="Hochatown/Broken Bow OK">Hochatown / Broken Bow, OK</option>
  <option value="Hot Springs AR">Hot Springs, AR</option>
  <option value="Ozark Mtns / Branson MO">Ozark Mountains / Branson, MO</option>
  <option value="Grand Lake OK">Grand Lake O' the Cherokees, OK</option>
  <option value="Fayetteville/Bentonville AR">Fayetteville / Bentonville, AR</option>
</select>

          <input
            type="text"
            name="propertyName"
            placeholder="Property Name"
            value={form.propertyName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="text"
            name="contactPhone"
            placeholder="Contact Phone"
            value={form.contactPhone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <input
            type="text"
            name="propertyManagementCompany"
            placeholder="Property Management Company"
            value={form.propertyManagementCompany}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <input
            type="text"
            name="ownerName"
            placeholder="Owner's Name"
            value={form.ownerName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <textarea
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="guestPresent"
                checked={form.guestPresent}
                onChange={handleChange}
              />
              Guest Present?
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="emergency"
                checked={form.emergency}
                onChange={handleChange}
              />
              Emergency?
            </label>
          </div>
          <input
            type="datetime-local"
            name="serviceRequestedBy"
            value={form.serviceRequestedBy}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            🚀 Submit Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitJob;
