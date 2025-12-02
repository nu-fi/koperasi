import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { generateLoanTimeline } from '../../context/loanTimelineGenerator' // Import the helper from Step 2

// --- REUSING YOUR COMPONENT CODE (Slightly Adapted) ---
const Timeline = ({ items }) =>
  items.length > 0 && (
    <div className="relative my-10 flex flex-col after:absolute after:left-[calc(50%_-_2px)] after:h-full after:w-1 after:content-normal after:bg-slate-200">
      {items.map((data, idx) => (
        <TimelineItem data={data} key={idx} />
      ))}
    </div>
  );

const TimelineItem = ({ data }) => {
  let {
    date,
    text,
    link,
    category: { tag, color, bgColor },
  } = data;

  return (
    <div className="group relative my-[10px] flex w-1/2 justify-end pr-[22px] odd:justify-start odd:self-end odd:pl-[22px] odd:pr-0 sm:pr-[30px] sm:odd:pl-[30px]">
      <div className="relative flex w-[400px] max-w-[95%] flex-col items-center rounded-[8px] bg-white px-4 py-[15px] text-center shadow-md border border-gray-100 after:absolute after:right-[-7.5px] after:top-[calc(50%-7.5px)] after:h-4 after:w-4 after:rotate-45 after:content-normal after:bg-white after:shadow-[1px_-1px_1px_rgba(0,0,0,0.1)] group-odd:items-center group-odd:text-center group-odd:after:left-[-7.5px] group-odd:after:right-auto group-odd:after:shadow-[-1px_1px_1px_rgba(0,0,0,0.1)] sm:max-w-[70%] md:items-end md:p-4 md:text-right md:group-odd:items-start md:group-odd:text-left">
        <span
          className="absolute left-[5px] top-[5px] w-[calc(100%-10px)] rounded px-2 py-1 text-center text-[10px] font-bold uppercase tracking-[1px] group-odd:left-auto group-odd:right-1 md:w-auto"
          style={{ backgroundColor: bgColor, color: color ? color : '#4d4d4d' }}
        >
          {tag}
        </span>
        <time className="mt-6 text-xs font-semibold text-gray-500 md:m-0">{date}</time>
        <p className="my-3 text-sm text-gray-700 leading-relaxed">{text}</p>
        <span className="absolute -right-8 top-[calc(50%-10px)] z-50 h-5 w-5 rounded-full border-[4px] border-white bg-slate-400 shadow group-odd:-left-8 group-odd:right-auto sm:-right-10 sm:group-odd:-left-10" 
              style={{ backgroundColor: color || '#94a3b8' }} // Dot color matches tag
        />
      </div>
    </div>
  );
};
// ----------------------------------------------------

const LoanProgress = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Assuming you pass the Loan ID via URL, or just fetch the latest one
  // If you want to show the LATEST loan for the logged in user:
  useEffect(() => {
    const fetchLatestLoan = async () => {
      try {
        const token = localStorage.getItem('access');
        // You might need a specific endpoint for "my-latest-loan" or filter list
        // Let's assume you fetch the list and take the first one
        const response = await axios.get('http://127.0.0.1:8000/loans/my-applications/', {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.length > 0) {
            // Get the most recent application
            const latestLoan = response.data[0]; 
            // GENERATE THE TIMELINE DATA HERE
            const processedData = generateLoanTimeline(latestLoan);
            setTimelineData(processedData);
        }
      } catch (error) {
        console.error("Error fetching loan history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestLoan();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Status...</div>;
  if (timelineData.length === 0) return <div className="p-10 text-center">Belum ada pengajuan aktif. <Link to="/apply-loan" className="text-blue-500 underline">Ajukan sekarang</Link></div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Jejak Pengajuan</h2>
      <p className="text-center text-gray-500 mb-6">Pantau status pembiayaan Anda secara real-time</p>
      
      {/* Render the Timeline with Dynamic Data */}
      <Timeline items={timelineData} />
      
    </div>
  );
};

export default LoanProgress;