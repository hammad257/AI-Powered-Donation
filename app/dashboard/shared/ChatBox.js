'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '@/app/services/api';
import { toast } from 'react-toastify';

const ChatBox = ({ receiverId, donationId }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef();

  const roomId = `donation_${donationId}_${user._id}_${receiverId}`;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/messages/${roomId}`, 'GET', null, token);
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      const body = { roomId, message: newMsg };
      const msg = await apiRequest(`/messages`, 'POST', body, token);
      setMessages((prev) => [...prev, msg]);
      setNewMsg('');
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    if (isOpen) fetchMessages();
  }, [isOpen]);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 text-sm px-3 py-1 bg-green-200 hover:bg-gray-300 rounded"
      >
        {isOpen ? 'Hide Chat' : 'Show Chat'}
      </button>

      {isOpen && (
        <div className="border rounded shadow bg-white max-w-md">
          <div className="p-2 border-b bg-gray-100 text-sm font-semibold flex justify-between items-center">
            <span>Chat with {user.role === 'donor' ? 'Volunteer' : 'Donor'}</span>
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="h-64 overflow-y-auto px-3 py-2 space-y-1 bg-gray-50">
            {loading && messages.length === 0 ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={msg._id}
                  ref={i === messages.length - 1 ? scrollRef : null}
                  className={`text-sm ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-lg ${
                      msg.sender._id === user._id
                        ? 'bg-green-200 text-gray-800'
                        : 'bg-blue-200 text-gray-800'
                    }`}
                  >
                    {msg.message}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex border-t p-2 bg-white gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Type a message"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
