import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const PartsRequest = () => {
  const { jobId } = useParams();

  const [form, setForm] = useState({
    model_number: '',
    serial_number: '',
    part_number: '',
    common_name: '',
    technical_name: '',
    description: '',
    repair_level: '',
    tech_will_source: true,
  });

  const [partPhotoFile, setPartPhotoFile] = useState(null);
  const [invoicePhotoFile, setInvoicePhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const uploadFile = async (file, folder) => {
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('parts').upload(path, file);

    if (error) throw error;

    const { publicUrl } = supabase.storage
      .from('parts')
      .getPublicUrl(path).data;

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let partPhotoUrl = null;
      let invoicePhotoUrl = null;

      if (partPhotoFile) partPhotoUrl = await uploadFile(partPhotoFile, 'photos');
      if (invoicePhotoFile) invoicePhotoUrl = await uploadFile(invoicePhotoFile, 'invoices');

      const { error: insertError } = await supabase.from('part_requests').insert([
        {
          job_id: jobId,
          ...form,
          part_photo: partPhotoUrl,
          invoice_photo: invoicePhotoUrl,
        },
      ]);

      if (insertError) throw insertError;

      toast.success('✅ Part request submitted!');
      setForm({
        model_number: '',
        serial_number: '',
        part_number: '',
        common_name: '',
        technical_name: '',
        description: '',
        repair_level: '',
        tech_will_source: true,
      });
      setPartPhotoFile(null);
      setInvoicePhotoFile(null);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to submit part request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🧩 Request a Part</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="model_number"
          placeholder="Unit Model Number"
          value={form.model_number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="serial_number"
          placeholder="Unit Serial Number"
          value={form.serial_number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="part_number"
          placeholder="Part Number (if known)"
          value={form.part_number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="common_name"
          placeholder="Common Name (e.g., capacitor)"
          value={form.common_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="technical_name"
          placeholder="Technical Name (e.g., 35/5 µF 440V run capacitor)"
          value={form.technical_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Notes or additional details"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
        />

        <select
          name="repair_level"
          value={form.repair_level}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Repair Level</option>
          <option value="1">Level 1 - $198</option>
          <option value="2">Level 2 - $298</option>
          <option value="3">Level 3 - $498</option>
          <option value="4">Level 4 - $698</option>
          <option value="5">Level 5 - $998</option>
          <option value="6">Level 6 - $1998</option>
          <option value="7">Level 7 - $2998</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="tech_will_source"
            checked={form.tech_will_source}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span>Tech will supply part</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700">📸 Upload Part Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPartPhotoFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🧾 Upload Invoice (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInvoicePhotoFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {submitting ? 'Submitting...' : 'Submit Part Request'}
        </button>
      </form>
    </div>
  );
};

export default PartsRequest;
