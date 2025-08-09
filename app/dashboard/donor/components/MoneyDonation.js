'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';

/* -------------------------
   Small helper sub-components
   -------------------------*/

// money SVG icon
function MoneyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="5" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 9.5a3.5 3.5 0 106 0 3.5 3.5 0 00-6 0z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 15v.5a1 1 0 001 1h6a1 1 0 001-1V15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// status badge
function StatusPill({ status }) {
  const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold';
  if (!status) return null;

  if (status === 'approved') return <span className={`${base} bg-green-100 text-green-700`}>✅ Approved</span>;
  if (status === 'rejected') return <span className={`${base} bg-red-100 text-red-700`}>❌ Rejected</span>;
  if (status === 'pending') return <span className={`${base} bg-yellow-100 text-yellow-700`}>⏳ Pending</span>;

  return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
}

// status callout - big banner inside card (like food donation style)
function StatusBanner({ status }) {
  if (status === 'approved') {
    return (
      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="mt-2 text-sm text-blue-700 font-medium">Payment received — thank you for your donation! 💙</p>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p className="mt-2 text-sm text-red-700 font-medium">Payment failed or rejected — please try again or contact support.</p>
      </div>
    );
  }

  // pending -> light callout
  if (status === 'pending') {
    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-2 text-sm text-yellow-700 font-medium">Payment pending — waiting for confirmation.</p>
      </div>
    );
  }

  return null;
}

/* -------------------------
   Main Component
   -------------------------*/

export default function MyMoneyDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const itemsPerPage = 6;

  const fetchDonations = async () => {
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append('status', statusFilter);
      if (startDate) query.append('startDate', startDate);
      if (endDate) query.append('endDate', endDate);

      const data = await apiRequest(`/money/all?${query.toString()}`, 'GET', null, token);
      setDonations(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    }
  };

  useEffect(() => {
    if (token) fetchDonations();
  }, [token]);

  // client-side search
  const filtered = donations.filter((d) => {
    const s = search.trim().toLowerCase();
    if (!s) return true;
    return (
      String(d.amount).toLowerCase().includes(s) ||
      (d.purpose || '').toLowerCase().includes(s) ||
      (d.status || '').toLowerCase().includes(s)
    );
  });

  // pagination slicing
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // helpers
  const formatAmount = (amount) => {
    try {
      // show in PKR format
      return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);
    } catch {
      return `Rs. ${amount}`;
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Track your donations, receipts and statuses.</h2>
          {/* <p className="text-sm text-gray-600 mt-1">Track your donations, receipts and statuses.</p> */}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search amount, purpose or status..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MoneyIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      {currentItems.length === 0 ? (
        <div className="text-gray-600">No donations found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((donation) => (
            <div key={donation._id} className="bg-white rounded-lg shadow-md border border-gray-100 p-4 transition hover:shadow-lg">
              {/* top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <MoneyIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="text-lg font-semibold text-gray-800 truncate" title={String(donation.amount)}>
                      {formatAmount(donation.amount)}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(donation.createdAt || donation.date || donation._createdAt || Date.now()).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <StatusPill status={donation.status} />
                  {donation.receipt && (
                    <a
                      href={donation.receipt}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      View Receipt
                    </a>
                  )}
                </div>
              </div>

              {/* purpose */}
              <div className="mt-3">
                <div className="text-sm text-gray-500">Purpose</div>
                <div className="text-sm text-gray-700 mt-1 line-clamp-2" title={donation.purpose}>
                  {donation.purpose || '—'}
                </div>
              </div>

              {/* optional status banner */}
              <StatusBanner status={donation.status} />

              {/* bottom actions */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="text-sm text-gray-600">
                  <div><span className="font-medium">Txn ID:</span> <span className="truncate block max-w-[12rem]" title={donation.transactionId || donation.txnId || '—'}>{donation.transactionId || donation.txnId || '—'}</span></div>
                </div>

                <div className="flex items-center gap-2">
                  {/* If you later want buttons like "Contact Support" or "Download Receipt" you can add here */}
                  <button
                    onClick={() => {
                      // quick copy txn id
                      const id = donation.transactionId || donation.txnId || '';
                      if (!id) return toast.info('No transaction id available');
                      navigator.clipboard.writeText(id);
                      toast.success('Transaction ID copied');
                    }}
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                    title="Copy transaction id"
                  >
                    Copy ID
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded border ${num === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
