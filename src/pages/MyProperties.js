import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import { v4 as uuidv4 } from 'uuid';

const MyProperties = () => {
  const { user } = useUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    door_code: '',
    notes: '',
  });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    if (user) fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error.message);
    } else {
      setProperties(data);
    }
    setLoading(false);
  };

  const handleAddProperty = async () => {
    if (!newProperty.name || !newProperty.address) {
      alert('Name and Address are required.');
      return;
    }

    let uploadedPhotoUrl = null;

    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('property-photos')
        .upload(fileName, photoFile);

      if (uploadError) {
        console.error('Photo upload error:', uploadError.message);
        alert('Failed to upload image.');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('property-photos')
        .getPublicUrl(fileName);

      uploadedPhotoUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('properties').insert([{
      id: uuidv4(),
      client_id: user.id,
      name: newProperty.name,
      address: newProperty.address,
      door_code: newProperty.door_code || null,
      notes: newProperty.notes || null,
      photo_url: uploadedPhotoUrl,
    }]);

    if (error) {
      console.error('Error adding property:', error.message);
    } else {
      setNewProperty({ name: '', address: '', door_code: '', notes: '' });
      setPhotoFile(null);
      fetchProperties();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏡 My Properties</h1>

      {/* Add Property Form */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-4">
        <input
          type="text"
          placeholder="Property Name"
          value={newProperty.name}
          onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={newProperty.address}
          onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Door Code (optional)"
          value={newProperty.door_code}
          onChange={(e) => setNewProperty({ ...newProperty, door_code: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Notes (optional)"
          value={newProperty.notes}
          onChange={(e) => setNewProperty({ ...newProperty, notes: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={handleAddProperty}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Property
        </button>
      </div>

      {/* Property List */}
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties saved yet.</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white p-4 rounded-xl shadow border space-y-2"
            >
              {property.photo_url && (
                <img
                  src={property.photo_url}
                  alt="Property"
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="text-lg font-semibold">{property.name}</h3>
              <p className="text-gray-600">📍 {property.address}</p>
              {property.door_code && <p>🔑 Door Code: {property.door_code}</p>}
              {property.notes && <p>📝 Notes: {property.notes}</p>}
              <div className="pt-2">
                <button className="text-sm text-blue-600 hover:underline mr-4">Edit</button>
                <button className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
