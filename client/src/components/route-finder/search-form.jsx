import { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function SearchForm({ onRouteFound }) {
  const [formData, setFormData] = useState({
    source: '',
    destination: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/routes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to find routes');
      }

      const data = await response.json();
      onRouteFound(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="source" className="block text-sm font-medium mb-1">Source Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="pl-9 w-full p-2 border rounded-md"
              placeholder="Enter starting point"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium mb-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="pl-9 w-full p-2 border rounded-md"
              placeholder="Enter destination"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Searching..." : "Find Routes"}
      </button>
    </form>
  );
}
