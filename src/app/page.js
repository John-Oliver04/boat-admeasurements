'use client';

import { useState, useEffect } from 'react';
import { Download, Plus, List, Search, Edit, Trash2, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default function Home() {
  const [boats, setBoats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [editingBoat, setEditingBoat] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boatToDelete, setBoatToDelete] = useState(null);

  // Load boats from localStorage on component mount
  useEffect(() => {
    const savedBoats = localStorage.getItem('boats');
    if (savedBoats) {
      setBoats(JSON.parse(savedBoats));
    } else {
      // Add complete sample data if no boats exist
      const sampleBoat = {
        id: '1',
        ownerName: 'John Oliver G. Virola',
        ownerAddress: 'Paluan, Occidental Mindoro',
        boatName: 'John Oliver',
        boatBuilder: 'Emilio Aguinaldo',
        yearOfBuild: '2019',
        engineMake: 'Yanmar',
        engineSerial: 'YM-56789',
        horsePower: '250 HP',
        numberOfCylinders: '6',
        placeOfAdmeasurement: 'Paluan, Occidental Mindoro',
        registerLength: '15.5',
        registerBreadth: '4.2',
        registerDepth: '2.1',
        tonnageLength: '14.8',
        tonnageBreadth: '4.0',
        tonnageDepth: '2.0',
        grossTonnage: '45',
        netTonnage: '25',
        createdAt: '8/29/2025',
        updatedAt: '8/29/2025'
      };
      setBoats([sampleBoat]);
      localStorage.setItem('boats', JSON.stringify([sampleBoat]));
    }
  }, []);

  // Save boats to localStorage whenever boats array changes
  useEffect(() => {
    localStorage.setItem('boats', JSON.stringify(boats));
  }, [boats]);

  const filteredBoats = boats.filter(boat => 
    boat.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boat.boatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(boats);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Boats');
    XLSX.writeFile(workbook, 'boat_records.xlsx');
  };

  const exportToPDF = (boat) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Boat Admeasurement Certificate', 20, 30);
    
    doc.setFontSize(12);
    let yPos = 50;
    
    // Owner Details
    doc.text('Owner Details:', 20, yPos);
    yPos += 10;
    doc.text(`Name: ${boat.ownerName}`, 30, yPos);
    yPos += 8;
    doc.text(`Address: ${boat.ownerAddress}`, 30, yPos);
    yPos += 8;
    doc.text(`Boat Name: ${boat.boatName}`, 30, yPos);
    yPos += 8;
    doc.text(`Builder: ${boat.boatBuilder}`, 30, yPos);
    yPos += 8;
    doc.text(`Year of Build: ${boat.yearOfBuild}`, 30, yPos);
    yPos += 8;
    doc.text(`Engine Make: ${boat.engineMake}`, 30, yPos);
    yPos += 8;
    doc.text(`Engine Serial: ${boat.engineSerial}`, 30, yPos);
    yPos += 8;
    doc.text(`Horse Power: ${boat.horsePower}`, 30, yPos);
    yPos += 8;
    doc.text(`Cylinders: ${boat.numberOfCylinders}`, 30, yPos);
    yPos += 8;
    doc.text(`Place of Admeasurement: ${boat.placeOfAdmeasurement}`, 30, yPos);
    
    yPos += 20;
    
    // Boat Measurements
    doc.text('Boat Measurements:', 20, yPos);
    yPos += 10;
    doc.text(`Register Length (RL): ${boat.registerLength}`, 30, yPos);
    yPos += 8;
    doc.text(`Register Breadth (RB): ${boat.registerBreadth}`, 30, yPos);
    yPos += 8;
    doc.text(`Register Depth (RD): ${boat.registerDepth}`, 30, yPos);
    yPos += 8;
    doc.text(`Tonnage Length (TL): ${boat.tonnageLength}`, 30, yPos);
    yPos += 8;
    doc.text(`Tonnage Breadth (TB): ${boat.tonnageBreadth}`, 30, yPos);
    yPos += 8;
    doc.text(`Tonnage Depth (TD): ${boat.tonnageDepth}`, 30, yPos);
    yPos += 8;
    doc.text(`Gross Tonnage (GT): ${boat.grossTonnage}`, 30, yPos);
    yPos += 8;
    doc.text(`Net Tonnage (NT): ${boat.netTonnage}`, 30, yPos);
    
    doc.save(`boat_certificate_${boat.ownerName.replace(/\s+/g, '_')}.pdf`);
  };

  const deleteBoat = (boat) => {
    setBoatToDelete(boat);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (boatToDelete) {
      setBoats(boats.filter(boat => boat.id !== boatToDelete.id));
      setShowDeleteModal(false);
      setBoatToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBoatToDelete(null);
  };

  const editBoat = (boat) => {
    setEditingBoat(boat);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg m-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Boat Admeasurement</h1>
              <p className="text-gray-400">Maritime Certification System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Total Records</span>
            <span className="text-2xl font-bold">{boats.length}</span>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingBoat(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Record</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2">
            <List className="w-4 h-4" />
            <span>All Records</span>
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="mx-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search boats or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="boat">Sort by Boat</option>
          </select>
        </div>
      </div>

      {/* Boat Records */}
      <div className="mx-6 space-y-4">
        {filteredBoats.map((boat) => (
          <div key={boat.id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{boat.ownerName}</h3>
                <p className="text-gray-400 mb-4">Owner: {boat.ownerAddress}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Builder:</span>
                    <p className="font-medium">{boat.boatBuilder}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Year:</span>
                    <p className="font-medium">{boat.yearOfBuild}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Engine:</span>
                    <p className="font-medium">{boat.engineMake}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Power:</span>
                    <p className="font-medium">{boat.horsePower}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">RL:</span>
                    <p className="font-medium">{boat.registerLength}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">RB:</span>
                    <p className="font-medium">{boat.registerBreadth}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">RD:</span>
                    <p className="font-medium">{boat.registerDepth}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">TL:</span>
                    <p className="font-medium">{boat.tonnageLength}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>📅 Created: {boat.createdAt}</span>
                  <span>Updated: {boat.updatedAt}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportToPDF(boat)}
                  className="p-2 text-green-400 hover:bg-gray-700 rounded-lg"
                  title="Export PDF"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={() => editBoat(boat)}
                  className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteBoat(boat)}
                  className="p-2 text-red-400 hover:bg-gray-700 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BoatForm
          boat={editingBoat}
          onSave={(boatData) => {
            if (editingBoat) {
              setBoats(boats.map(b => b.id === editingBoat.id ? { ...boatData, id: editingBoat.id } : b));
            } else {
              const newBoat = {
                ...boatData,
                id: Date.now().toString(),
                createdAt: new Date().toLocaleDateString(),
                updatedAt: new Date().toLocaleDateString()
              };
              setBoats([...boats, newBoat]);
            }
            setShowForm(false);
            setEditingBoat(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingBoat(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the boat record for{' '}
              <span className="font-semibold text-white">{boatToDelete?.ownerName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-center py-4 text-gray-400 border-t border-gray-700">
        <p>🚢 Developer: John Oliver Virola</p>
      </footer>
    </div>
  );
}

// Boat Form Component
function BoatForm({ boat, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerAddress: '',
    boatName: '',
    boatBuilder: '',
    yearOfBuild: '',
    engineMake: '',
    engineSerial: '',
    horsePower: '',
    numberOfCylinders: '',
    placeOfAdmeasurement: '',
    registerLength: '',
    registerBreadth: '',
    registerDepth: '',
    tonnageLength: '',
    tonnageBreadth: '',
    tonnageDepth: '',
    grossTonnage: '',
    netTonnage: '',
    ...boat
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toLocaleDateString()
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {boat ? 'Edit Boat Registration' : 'New Boat Registration'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Owner Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Owner *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name of Boat *</label>
                <input
                  type="text"
                  name="boatName"
                  value={formData.boatName}
                  onChange={handleChange}
                  placeholder="Enter boat name"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address *</label>
                <textarea
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Boat Builder (Full Name) *</label>
                <input
                  type="text"
                  name="boatBuilder"
                  value={formData.boatBuilder}
                  onChange={handleChange}
                  placeholder="Enter boat builder name"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Build *</label>
                <input
                  type="text"
                  name="yearOfBuild"
                  value={formData.yearOfBuild}
                  onChange={handleChange}
                  placeholder="YYYY"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Engine Make *</label>
                <input
                  type="text"
                  name="engineMake"
                  value={formData.engineMake}
                  onChange={handleChange}
                  placeholder="Enter engine make"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Engine Serial No. *</label>
                <input
                  type="text"
                  name="engineSerial"
                  value={formData.engineSerial}
                  onChange={handleChange}
                  placeholder="Enter engine serial number"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Horse Power *</label>
                <input
                  type="text"
                  name="horsePower"
                  value={formData.horsePower}
                  onChange={handleChange}
                  placeholder="Enter horse power"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">No. of Cylinder *</label>
                <input
                  type="text"
                  name="numberOfCylinders"
                  value={formData.numberOfCylinders}
                  onChange={handleChange}
                  placeholder="Enter number of cylinders"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Place of Admeasurement *</label>
                <input
                  type="text"
                  name="placeOfAdmeasurement"
                  value={formData.placeOfAdmeasurement}
                  onChange={handleChange}
                  placeholder="Enter place of admeasurement"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Boat Measurements Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Boat Measurements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Register Length (RL) *</label>
                <input
                  type="text"
                  name="registerLength"
                  value={formData.registerLength}
                  onChange={handleChange}
                  placeholder="Enter RL"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Register Breadth (RB) *</label>
                <input
                  type="text"
                  name="registerBreadth"
                  value={formData.registerBreadth}
                  onChange={handleChange}
                  placeholder="Enter RB"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Register Depth (RD) *</label>
                <input
                  type="text"
                  name="registerDepth"
                  value={formData.registerDepth}
                  onChange={handleChange}
                  placeholder="Enter RD"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tonnage Length (TL) *</label>
                <input
                  type="text"
                  name="tonnageLength"
                  value={formData.tonnageLength}
                  onChange={handleChange}
                  placeholder="Enter TL"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tonnage Breadth (TB) *</label>
                <input
                  type="text"
                  name="tonnageBreadth"
                  value={formData.tonnageBreadth}
                  onChange={handleChange}
                  placeholder="Enter TB"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tonnage Depth (TD) *</label>
                <input
                  type="text"
                  name="tonnageDepth"
                  value={formData.tonnageDepth}
                  onChange={handleChange}
                  placeholder="Enter TD"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gross Tonnage (GT) *</label>
                <input
                  type="text"
                  name="grossTonnage"
                  value={formData.grossTonnage}
                  onChange={handleChange}
                  placeholder="Enter GT"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Net Tonnage (NT) *</label>
                <input
                  type="text"
                  name="netTonnage"
                  value={formData.netTonnage}
                  onChange={handleChange}
                  placeholder="Enter NT"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
