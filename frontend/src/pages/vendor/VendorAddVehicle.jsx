import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const VendorAddVehicle = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: 2024,
    price: '',
    description: '',
    condition: 'NEW',
    mileage: 0,
    rangeKm: '',
    batteryCapacityKwh: '',
    chargingTimeHours: 6,
    topSpeedKmh: 160,
    seatingCapacity: 5,
    bodyType: 'SUV',
    location: 'Mumbai',
    features: 'Fast Charging, Autopilot, Glass Roof, Heated Seats',
    imageUrl: '',
    stock: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.brand || !formData.price || !formData.rangeKm || !formData.batteryCapacityKwh) {
      showError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const images = formData.imageUrl
        ? [formData.imageUrl]
        : ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80'];

      const payload = {
        ...formData,
        price: Number(formData.price),
        rangeKm: Number(formData.rangeKm),
        batteryCapacityKwh: Number(formData.batteryCapacityKwh),
        images,
        features: formData.features.split(',').map((f) => f.trim()),
      };

      await API.post('/vendor/vehicles', payload);
      showSuccess('EV listing submitted for Admin Approval!');
      navigate('/vendor/vehicles');
    } catch (err) {
      showError(err.message || 'Failed to add vehicle listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          List New Electric Vehicle
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Submit vehicle specs for admin verification before publishing to marketplace.
        </p>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Listing Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Tesla Model 3 Long Range"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Brand / Manufacturer</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Tesla, Tata, Hyundai..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Model Name</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Model 3"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Model Year</label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="4500000"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Claimed Range (km)</label>
              <input
                type="number"
                required
                value={formData.rangeKm}
                onChange={(e) => setFormData({ ...formData, rangeKm: e.target.value })}
                placeholder="500"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Battery (kWh)</label>
              <input
                type="number"
                required
                value={formData.batteryCapacityKwh}
                onChange={(e) => setFormData({ ...formData, batteryCapacityKwh: e.target.value })}
                placeholder="75"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Body Type</label>
              <select
                value={formData.bodyType}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Crossover">Crossover</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail interior, performance, autopilot features..."
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {submitting ? <span>Submitting...</span> : <span>Submit for Admin Approval</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorAddVehicle;
