/**
 * LabLink Interactive Script — Tugas 2 Pemrograman Frontend
 * Navigasi terpisah per halaman (Single-Page Navigation) persis seperti prototipe Figma:
 * Beranda, Katalog Alat, Detail Alat, Ajukan Peminjaman, Peminjaman Saya, Resi Digital, & Dasbor Pengelola.
 */

document.addEventListener('DOMContentLoaded', () => {
  let activeLoanCount = 1;
  let filterOnlyAvailable = false;

  // 1. FUNGSI UTAMA PINDAH HALAMAN (Hanya 1 halaman tampil pada satu waktu)
  const btnMobileMenu = document.getElementById('btn-mobile-menu');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');
  const pageHeading = document.getElementById('page-heading');
  const roleBadge = document.getElementById('role-badge');

  function showPage(sectionId, customTitle, activeSidebarTarget) {
    // Sembunyikan seluruh halaman kecuali sectionId yang dituju
    viewSections.forEach((sec) => {
      sec.hidden = sec.id !== sectionId;
    });

    // Tentukan menu sidebar mana yang harus aktif
    const navTarget = activeSidebarTarget || sectionId;
    navItems.forEach((item) => {
      const isMatch = item.dataset.target === navTarget;
      item.classList.toggle('active', isMatch);
      if (isMatch && !customTitle) {
        pageHeading.textContent = item.dataset.title || 'Beranda';
      }
    });

    if (customTitle) {
      pageHeading.textContent = customTitle;
    }

    // Ubah badge di kanan atas sesuai halaman
    roleBadge.textContent = sectionId === 'view-pengelola' ? 'Pengelola' : 'Mahasiswa';

    // Tutup menu mobile otomatis setelah memilih halaman
    if (sidebarMenu.classList.contains('is-open')) {
      sidebarMenu.classList.remove('is-open');
      btnMobileMenu.setAttribute('aria-expanded', 'false');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle menu mobile
  if (btnMobileMenu && sidebarMenu) {
    btnMobileMenu.addEventListener('click', () => {
      const isOpen = sidebarMenu.classList.toggle('is-open');
      btnMobileMenu.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Klik menu di Sidebar Kiri
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(item.dataset.target, item.dataset.title, item.dataset.target);
    });
  });

  // Klik tombol navigasi antar-halaman (Buka katalog, Ajukan peminjaman, Lihat resi digital, dll.)
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(btn.dataset.goto, btn.dataset.title, btn.dataset.nav);
    });
  });

  // Pastikan saat pertama kali dimuat hanya halaman Beranda yang tampil
  showPage('view-beranda', 'Beranda', 'view-beranda');

  // 2. KOMPONEN PENCARIAN & FILTER TERSEDIA PADA KATALOG ALAT
  const inputCariAlat = document.getElementById('input-cari-alat');
  const btnFilterTersedia = document.getElementById('btn-filter-tersedia');
  const alatCards = document.querySelectorAll('.alat-card');
  const katalogKosong = document.getElementById('katalog-kosong');

  function filterKatalog() {
    const keyword = inputCariAlat.value.trim().toLowerCase();
    let visibleCount = 0;

    alatCards.forEach((card) => {
      const name = (card.dataset.name || '').toLowerCase();
      const status = card.dataset.status || '';

      const matchKeyword = name.includes(keyword);
      const matchAvailable = !filterOnlyAvailable || status === 'tersedia';

      if (matchKeyword && matchAvailable) {
        card.hidden = false;
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    katalogKosong.hidden = visibleCount > 0;
  }

  inputCariAlat.addEventListener('input', filterKatalog);

  btnFilterTersedia.addEventListener('click', () => {
    filterOnlyAvailable = !filterOnlyAvailable;
    btnFilterTersedia.setAttribute('aria-pressed', String(filterOnlyAvailable));
    btnFilterTersedia.textContent = filterOnlyAvailable
      ? '✓ Hanya tersedia'
      : 'Filter tersedia';
    filterKatalog();
  });

  // 3. KOMPONEN DETAIL ALAT DINAMIS (Buka Halaman Detail Alat)
  const detailHeading = document.getElementById('detail-heading');
  const detailPreviewBox = document.getElementById('detail-preview-box');
  const detailId = document.getElementById('detail-id');
  const detailTitle = document.getElementById('detail-title');
  const detailBadge = document.getElementById('detail-badge');
  const detailStok = document.getElementById('detail-stok');
  const detailKondisi = document.getElementById('detail-kondisi');
  const detailKelengkapan = document.getElementById('detail-kelengkapan');
  const detailCatatan = document.getElementById('detail-catatan');
  const inputNamaAlat = document.getElementById('input-nama-alat');

  document.querySelectorAll('.btn-lihat-detail').forEach((btn) => {
    btn.addEventListener('click', () => {
      detailHeading.textContent = btn.dataset.short || btn.dataset.title;
      detailPreviewBox.textContent = btn.dataset.short || btn.dataset.title;
      detailId.textContent = `ID: ${btn.dataset.id}`;
      detailTitle.textContent = btn.dataset.title;
      detailBadge.textContent = btn.dataset.status;
      detailBadge.className =
        btn.dataset.status === 'Tersedia' ? 'badge badge-teal' : 'badge badge-amber';
      detailStok.textContent = btn.dataset.stok;
      detailKondisi.textContent = btn.dataset.kondisi;
      detailKelengkapan.textContent = btn.dataset.kelengkapan;
      detailCatatan.textContent = btn.dataset.catatan;

      // Isi otomatis nama alat pada form pengajuan
      inputNamaAlat.value = `${btn.dataset.title} (${btn.dataset.id})`;

      // Pindah ke Halaman Detail Alat
      showPage('view-detail', 'Detail alat', 'view-katalog');
    });
  });

  // 4. KOMPONEN VALIDASI FORMULIR AJUKAN PEMINJAMAN
  const formPeminjaman = document.getElementById('form-peminjaman');
  const inputKeperluan = document.getElementById('input-keperluan');
  const inputJadwal = document.getElementById('input-jadwal');
  const inputKontak = document.getElementById('input-kontak');
  const formErrorMsg = document.getElementById('form-error-msg');
  const formSuccessMsg = document.getElementById('form-success-msg');
  const activeLoanList = document.getElementById('active-loan-list');
  const navLoanCounter = document.getElementById('nav-loan-counter');
  const summaryActiveCount = document.getElementById('summary-active-count');

  formPeminjaman.addEventListener('submit', (e) => {
    e.preventDefault();
    formErrorMsg.hidden = true;
    formSuccessMsg.hidden = true;

    const alatVal = inputNamaAlat.value.trim();
    const keperluanVal = inputKeperluan.value.trim();
    const jadwalVal = inputJadwal.value.trim();
    const kontakVal = inputKontak.value.trim();

    if (!alatVal || keperluanVal.length < 4 || jadwalVal.length < 4 || kontakVal.length < 4) {
      formErrorMsg.textContent =
        'Harap lengkapi seluruh kolom formulir pengajuan dengan benar.';
      formErrorMsg.hidden = false;
      return;
    }

    // Tambahkan kartu ke daftar Peminjaman Saya
    const newRow = document.createElement('article');
    newRow.className = 'row-card';
    newRow.innerHTML = `
      <div>
        <h4>${alatVal}</h4>
        <p class="text-muted">${jadwalVal} · ${keperluanVal} (${kontakVal})</p>
      </div>
      <span class="badge badge-amber">Menunggu</span>
    `;
    activeLoanList.prepend(newRow);

    activeLoanCount++;
    navLoanCounter.textContent = String(activeLoanCount);
    summaryActiveCount.textContent = `${activeLoanCount} peminjaman aktif`;

    formSuccessMsg.textContent = `Pengajuan berhasil dikirim! Mengalihkan ke halaman Peminjaman saya...`;
    formSuccessMsg.hidden = false;

    setTimeout(() => {
      formSuccessMsg.hidden = true;
      showPage('view-peminjaman', 'Peminjaman saya', 'view-peminjaman');
    }, 900);
  });

  // 5. KOMPONEN PEMINJAMAN SAYA & DASBOR PENGELOLA
  const btnAjukanKembali = document.getElementById('btn-ajukan-kembali');
  const btnLaporMasalah = document.getElementById('btn-lapor-masalah');
  const peminjamanFeedback = document.getElementById('peminjaman-action-feedback');
  const activeLoanBadge = document.getElementById('active-loan-badge');

  btnAjukanKembali.addEventListener('click', () => {
    activeLoanBadge.textContent = 'Menunggu verifikasi';
    activeLoanBadge.className = 'badge badge-amber';
    peminjamanFeedback.textContent =
      'Pengajuan pengembalian dicatat. Resi digital akan diterbitkan setelah alat diverifikasi pengelola lab.';
    peminjamanFeedback.hidden = false;
  });

  btnLaporMasalah.addEventListener('click', () => {
    peminjamanFeedback.textContent =
      'Laporan kendala perangkat telah diteruskan ke pengelola laboratorium.';
    peminjamanFeedback.hidden = false;
  });

  // Tombol interaktif di Dasbor Pengelola
  const btnAdminApprove = document.getElementById('btn-admin-approve');
  const btnAdminReject = document.getElementById('btn-admin-reject');
  const adminReqBadge = document.getElementById('admin-req-badge');
  const btnAdminVerify = document.getElementById('btn-admin-verify');
  const adminVerifyBadge = document.getElementById('admin-verify-badge');
  const receiptCode = document.getElementById('receipt-code');

  btnAdminApprove.addEventListener('click', () => {
    adminReqBadge.textContent = 'Disetujui';
    adminReqBadge.className = 'badge badge-teal';
    activeLoanBadge.textContent = 'Disetujui';
    activeLoanBadge.className = 'badge badge-teal';
  });

  btnAdminReject.addEventListener('click', () => {
    adminReqBadge.textContent = 'Ditolak';
  });

  btnAdminVerify.addEventListener('click', () => {
    adminVerifyBadge.textContent = 'Terverifikasi';
    adminVerifyBadge.className = 'badge badge-teal';
    receiptCode.textContent = '#LL-020';
  });
});