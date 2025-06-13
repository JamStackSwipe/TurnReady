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
            type="tel"
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
            required
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
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows={4}
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="guestPresent"
              checked={form.guestPresent}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Guest Present</span>
          </label>
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Next Check-In
          </label>
          <input
            type="date"
            name="nextCheckIn"
            value={form.nextCheckIn}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <input
            type="text"
            name="serviceRequestedBy"
            placeholder="Requested By"
            value={form.serviceRequestedBy}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="emergency"
              checked={form.emergency}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Emergency</span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            🚀 Submit Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitJob;
