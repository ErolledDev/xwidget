import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AutoReply as AutoReplyType } from '../../types';
import { Upload, Download, Plus, Trash2, Save } from 'lucide-react';
import * as XLSX from 'xlsx';
import stringSimilarity from 'string-similarity';

const AutoReply: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [autoReplies, setAutoReplies] = useState<AutoReplyType[]>([]);
  const [newReply, setNewReply] = useState<Partial<AutoReplyType>>({
    keyword: '',
    response: '',
    match_type: 'exact',
    synonyms: []
  });
  const [synonymInput, setSynonymInput] = useState('');

  useEffect(() => {
    if (user) {
      fetchAutoReplies();
    }
  }, [user]);

  const fetchAutoReplies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('auto_replies')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setAutoReplies(data || []);
    } catch (error) {
      console.error('Error fetching auto replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReply(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSynonym = () => {
    if (synonymInput.trim()) {
      setNewReply(prev => ({
        ...prev,
        synonyms: [...(prev.synonyms || []), synonymInput.trim()]
      }));
      setSynonymInput('');
    }
  };

  const handleRemoveSynonym = (index: number) => {
    setNewReply(prev => ({
      ...prev,
      synonyms: (prev.synonyms || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddReply = async () => {
    if (!newReply.keyword || !newReply.response) {
      alert('Keyword and response are required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('auto_replies')
        .insert({
          user_id: user?.id,
          keyword: newReply.keyword,
          response: newReply.response,
          match_type: newReply.match_type,
          synonyms: newReply.synonyms
        })
        .select();

      if (error) throw error;
      
      if (data) {
        setAutoReplies(prev => [...prev, data[0]]);
        setNewReply({
          keyword: '',
          response: '',
          match_type: 'exact',
          synonyms: []
        });
      }
    } catch (error) {
      console.error('Error adding auto reply:', error);
      alert('Failed to add auto reply. Please try again.');
    }
  };

  const handleDeleteReply = async (id: string) => {
    try {
      const { error } = await supabase
        .from('auto_replies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAutoReplies(prev => prev.filter(reply => reply.id !== id));
    } catch (error) {
      console.error('Error deleting auto reply:', error);
      alert('Failed to delete auto reply. Please try again.');
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const binaryData = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(binaryData, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as { keyword: string; response: string; match_type?: string }[];
        
        if (jsonData.length === 0) {
          alert('No data found in the Excel file');
          return;
        }
        
        // Prepare data for insertion
        const newReplies = jsonData.map(row => ({
          user_id: user?.id,
          keyword: row.keyword,
          response: row.response,
          match_type: (row.match_type as 'exact' | 'fuzzy' | 'regex' | 'synonym') || 'exact'
        }));
        
        // Insert into database
        const { data: insertedData, error } = await supabase
          .from('auto_replies')
          .insert(newReplies)
          .select();
          
        if (error) throw error;
        
        if (insertedData) {
          setAutoReplies(prev => [...prev, ...insertedData]);
          alert(`Successfully imported ${insertedData.length} auto replies`);
        }
      } catch (error) {
        console.error('Error importing Excel:', error);
        alert('Failed to import Excel file. Please check the format and try again.');
      }
    };
    
    reader.readAsArrayBuffer(file);
    // Reset the input
    e.target.value = '';
  };

  const handleExportExcel = () => {
    if (autoReplies.length === 0) {
      alert('No data to export');
      return;
    }
    
    // Prepare data for export
    const exportData = autoReplies.map(reply => ({
      keyword: reply.keyword,
      response: reply.response,
      match_type: reply.match_type,
      synonyms: reply.synonyms ? reply.synonyms.join(', ') : ''
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auto Replies');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'auto_replies_export.xlsx');
  };

  // Function to test matching
  const testMatching = (input: string, keyword: string, matchType: string, synonyms?: string[]) => {
    switch (matchType) {
      case 'exact':
        return input.toLowerCase() === keyword.toLowerCase();
      case 'fuzzy':
        return stringSimilarity.compareTwoStrings(input.toLowerCase(), keyword.toLowerCase()) > 0.6;
      case 'regex':
        try {
          const regex = new RegExp(keyword, 'i');
          return regex.test(input);
        } catch (e) {
          return false;
        }
      case 'synonym':
        if (input.toLowerCase() === keyword.toLowerCase()) return true;
        return synonyms ? synonyms.some(s => s.toLowerCase() === input.toLowerCase()) : false;
      default:
        return false;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading auto replies...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Auto Reply Settings</h2>
        <div className="flex space-x-2">
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleImportExcel}
            />
          </label>
          <button
            onClick={handleExportExcel}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Add new auto reply form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Auto Reply</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keyword
            </label>
            <input
              type="text"
              name="keyword"
              value={newReply.keyword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter keyword"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Match Type
            </label>
            <select
              name="match_type"
              value={newReply.match_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="exact">Exact Match</option>
              <option value="fuzzy">Fuzzy Match</option>
              <option value="regex">Regular Expression</option>
              <option value="synonym">Synonym Match</option>
            </select>
          </div>
        </div>
        
        {newReply.match_type === 'synonym' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Synonyms
            </label>
            <div className="flex">
              <input
                type="text"
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add synonym"
              />
              <button
                type="button"
                onClick={handleAddSynonym}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md"
              >
                Add
              </button>
            </div>
            
            {newReply.synonyms && newReply.synonyms.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newReply.synonyms.map((synonym, index) => (
                  <div key={index} className="bg-gray-200 px-2 py-1 rounded-md flex items-center">
                    <span className="text-sm">{synonym}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSynonym(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Response
          </label>
          <textarea
            name="response"
            value={newReply.response}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter response message"
          ></textarea>
        </div>
        
        <button
          type="button"
          onClick={handleAddReply}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Auto Reply
        </button>
      </div>

      {/* List of auto replies */}
      <div>
        <h3 className="text-lg font-medium mb-3">Auto Replies</h3>
        
        {autoReplies.length === 0 ? (
          <p className="text-gray-500 italic">No auto replies added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {autoReplies.map((reply) => (
                  <tr key={reply.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reply.keyword}</div>
                      {reply.match_type === 'synonym' && reply.synonyms && reply.synonyms.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Synonyms: {reply.synonyms.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {reply.match_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{reply.response}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoReply;