import React, { useState, useEffect } from "react";
import { getColors, addColor, updateColor, deleteColor } from "../store/color";

interface Color {
  id: number;
  colorName: string;
}

const ColorPage = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState("");
  const [editColorId, setEditColorId] = useState<number | null>(null);
  const [editColorName, setEditColorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   const isValidColor = (colorStr: string): boolean => {
     if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(colorStr)) return true;
    
     if (/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.test(colorStr)) return true;
    if (/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0\.\d+)\)$/.test(colorStr)) return true;
    
     if (/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/.test(colorStr)) return true;
    if (/^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(0|1|0\.\d+)\)$/.test(colorStr)) return true;
    
     const s = new Option().style;
    s.color = colorStr;
    return s.color !== '';
  };

   const getDisplayColor = (colorName: string): string => {
    if (isValidColor(colorName)) {
      return colorName;
    }
    
     if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(colorName)) {
      return `#${colorName}`;
    }
    
     return "#6b7280";
  };

  const fetchColors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getColors("", 1, 20);
      setColors(data.data || []);
    } catch (error) {
      setError("Failed to load colors");
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddColor = async () => {
    if (!newColor.trim()) {
      setError("Please enter a color name or code");
      return;
    }
    
    try {
      await addColor(newColor.trim());
      setNewColor("");
      setError(null);
      await fetchColors();
    } catch (error) {
      setError("Failed to add color");
      console.error("Error adding color:", error);
    }
  };

  const handleEditColor = (id: number, name: string) => {
    setEditColorId(id);
    setEditColorName(name);
  };

  const handleUpdateColor = async () => {
    if (!editColorName.trim() || editColorId === null) {
      setError("Color name cannot be empty");
      return;
    }
    
    try {
      await updateColor(editColorId, editColorName.trim());
      setEditColorId(null);
      setEditColorName("");
      setError(null);
      await fetchColors();
    } catch (error) {
      setError("Failed to update color");
      console.error("Error updating color:", error);
    }
  };

  const handleDeleteColor = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this color?")) return;
    
    try {
      await deleteColor(id);
      await fetchColors();
    } catch (error) {
      setError("Failed to delete color");
      console.error("Error deleting color:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'update') => {
    if (e.key === 'Enter') {
      if (action === 'add') handleAddColor();
      if (action === 'update') handleUpdateColor();
    }
    if (e.key === 'Escape') {
      setEditColorId(null);
      setEditColorName("");
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Management</h1>
        <p className="text-gray-600">Add and manage colors with visual preview</p>
      </div>

       {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

       <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Color</h2>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter color name or code (red, #ff0000, rgb(255,0,0))"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'add')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
           
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-16 h-16 rounded-lg border-2 border-gray-300 mb-2"
              style={{ 
                backgroundColor: newColor.trim() ? getDisplayColor(newColor.trim()) : '#f3f4f6'
              }}
            />
            <button
              onClick={handleAddColor}
              disabled={!newColor.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Color
            </button>
          </div>
        </div>
      </div>

       <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Color List</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading colors...</p>
          </div>
        ) : colors.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-300 text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No colors yet</h3>
            <p className="text-gray-500 mb-6">Add your first color above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {colors.map((color) => {
              const displayColor = getDisplayColor(color.colorName);
              const isEditing = editColorId === color.id;
              
              return (
                <div key={color.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  {isEditing ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          className="w-12 h-12 rounded-lg border border-gray-300"
                          style={{ backgroundColor: getDisplayColor(editColorName) }}
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={editColorName}
                            onChange={(e) => setEditColorName(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, 'update')}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Preview will update as you type
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateColor}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditColorId(null);
                            setEditColorName("");
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
                            style={{ backgroundColor: displayColor }}
                          />
                          <div 
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow"
                            style={{ backgroundColor: displayColor }}
                          />
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-900">{color.colorName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {displayColor}
                            </code>
                            <span className="text-xs text-gray-500">ID: #{color.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditColor(color.id, color.colorName)}
                          className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteColor(color.id)}
                          className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

       
    </div>
  );
};

export default ColorPage;