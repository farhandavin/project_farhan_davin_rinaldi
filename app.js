// Menunggu sampai seluruh konten halaman dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Tentukan target di HTML tempat kita akan menaruh kartu
  const projectGrid = document.getElementById('project-grid');

  // 2. Ambil data dari file JSON
  fetch('projects.json')
    .then(response => {
      // Jika respons tidak ok (misal file tidak ditemukan), lempar error
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      // Ubah respons menjadi format JSON
      return response.json();
    })
    .then(projects => {
      // 3. Kita punya data 'projects'. Saatnya loop menggunakan forEach!
      projects.forEach(project => {
        
        // 4. Buat elemen HTML untuk setiap kartu proyek
        const cardHtml = `
          <div class="col">
            <div class="card shadow-sm">
              <img src="${project.imageUrl}" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="${project.title}">
              <div class="card-body">
                <h5 class="card-title">${project.title}</h5>
                <p class="card-text">${project.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <a href="${project.viewUrl}" class="btn btn-sm btn-outline-secondary">View</a>
                    <a href="${project.repoUrl}" class="btn btn-sm btn-outline-secondary">Repository</a>
                  </div>
                  <small class="text-body-secondary">${project.time}</small>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // 5. Masukkan HTML kartu yang sudah jadi ke dalam grid
        projectGrid.innerHTML += cardHtml;
      });
    })
    .catch(error => {
      // Tangani jika ada error saat mengambil file JSON
      console.error('Error fetching project data:', error);
      projectGrid.innerHTML = '<p class="text-center text-danger">Gagal memuat proyek. Silakan coba lagi nanti.</p>';
    });
});