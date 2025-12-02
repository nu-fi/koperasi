export const generateLoanTimeline = (loan) => {
  if (!loan) return [];

  const steps = [];

  // ---------------------------------------------------------
  // TAHAP 1: PENGAJUAN (Selalu Muncul)
  // ---------------------------------------------------------
  steps.push({
    text: `Pengajuan sebesar Rp ${parseInt(loan.amount_requested).toLocaleString('id-ID')} diterima.`,
    date: loan.application_date,
    category: { tag: 'Terkirim', bgColor: '#DFF4D9', color: '#1a472a' },
  });

  // ---------------------------------------------------------
  // TAHAP 2: REVIEW / VERIFIKASI
  // ---------------------------------------------------------
  // Logika Baru: Tampilkan tahap ini jika statusnya Pending, Approved, Rejected, atau Disbursed.
  // Artinya: Semua status "mengalami" proses review.
  const hasPassedReview = ['pending', 'approved', 'rejected', 'disbursed'].includes(loan.status);

  if (hasPassedReview) {
    steps.push({
      text: 'Tim kami melakukan verifikasi data dan survei kelayakan.',
      // Jika masih pending, tanggalnya "Sedang Proses". Jika sudah lewat, gunakan tgl aplikasi (atau tgl lain jika ada)
      date: loan.status === 'pending' ? 'Sedang Proses' : 'Selesai', 
      category: { tag: 'Review', bgColor: '#FFFAD1', color: '#854d0e' },
    });
  } 
  
  // ---------------------------------------------------------
  // TAHAP 3: KEPUTUSAN (Disetujui / Ditolak)
  // ---------------------------------------------------------
  if (['approved', 'disbursed'].includes(loan.status)) {
    steps.push({
      text: 'Selamat! Pengajuan pembiayaan Anda telah disetujui.',
      date: loan.approval_date || 'Selesai',
      category: { tag: 'Disetujui', bgColor: '#D1E7DD', color: '#0f5132' },
    });
  } else if (loan.status === 'rejected') {
    steps.push({
      text: 'Mohon maaf, pengajuan Anda belum dapat kami setujui saat ini.',
      date: loan.approval_date || 'Selesai',
      category: { tag: 'Ditolak', bgColor: '#F8D7DA', color: '#842029' },
    });
  }

  // ---------------------------------------------------------
  // TAHAP 4: PENCAIRAN (Disbursed)
  // ---------------------------------------------------------
  if (loan.status === 'disbursed') {
    steps.push({
      text: 'Dana telah dicairkan ke rekening terdaftar.',
      date: 'Selesai',
      category: { tag: 'Pencairan', bgColor: '#CFE2FF', color: '#084298' },
    });
  }

  // Reverse agar yang terbaru ada di paling atas
  return steps.reverse(); 
};