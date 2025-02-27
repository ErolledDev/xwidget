import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AdvancedReply as AdvancedReplyType } from '../../types';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const AdvancedReply: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advancedReplies, setAdvancedReplies] = useState<AdvancedReplyType[]>([]);
  const [newReply, setNewReply] = useState<Partial<AdvancedReplyType>>({
    keyword: '',
    button_text: '',
    response: '',
    url: '',
    match_type: 'contains'
  });

  useEffect(() => {
    if (user) {
      fetchAdvancedReplies();
    }
  }, [user]);

  const fetchAdvancedReplies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advanced_replies')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setAdvancedReplies(data || []);
    } catch (error) {
      console.error('Error fetching advanced replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReply(prev => ({ ...prev, [name]: value }));
  };

  const handleAddReply = async () => {
    if (!newReply.keyword || !newReply.button_text) {
      alert('Keyword and button text are required');
      return;
    }

    if (!newReply.response && !newReply.url) {
      alert('Either response or URL is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('advanced_replies')
        .insert({
          user_id: user?.id,
          keyword: newReply.keyword,
          button_text: newReply.button_text,
          response: newReply.response,
          url: newReply.url,
          match_type: newReply.match_type
        })
        .select();

      if (error) throw error;
      
      if (data) {
        setAdvancedReplies(prev => [...prev, data[0]]);
        setNewReply({
          keyword: '',
          button_text: '',
          response: '',
          url: '',
          match_type: 'contains'
        });
      }
    } catch (error) {
      console.error('Error adding advanced reply:', error);
      alert('Failed to add advanced reply. Please try again.');
    }
  };

  const handleDeleteReply = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advanced_replies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAdvancedReplies(prev => prev.filter(reply => reply.id !== id));
    } catch (error) {
      console.error('Error deleting advanced reply:', error);
      alert('Failed to delete advanced reply. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading advanced replies...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Advanced Reply Settings</h2>
      </div>

      {/* Add new advanced reply form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Advanced Reply</h3>
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
              <option value="contains">Contains</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            name="button_text"
            value={newReply.button_text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Text to display on the button"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response (Optional if URL is provided)
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (Optional if Response is provided)
            </label>
            <input
              type="text"
              name="url"
              value={newReply.url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              If provided, clicking the button will open this URL.
            </p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddReply}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Advanced Reply
        </button>
      </div>

      {/* List of advanced replies */}
      <div>
        <h3 className="text-lg font-medium mb-3">Advanced Replies</h3>
        
        {advancedReplies.length === 0 ? (
          <p className="text-gray-500 italic">No advanced replies added yet.</p>
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
                    Button Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advancedReplies.map((reply) => (
                  <tr key={reply.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reply.keyword}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {reply.match_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reply.button_text}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reply.url ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          URL
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Response
                        </span>
                      )}
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

export default AdvancedReply;