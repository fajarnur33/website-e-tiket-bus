const dataBus = [
    { id: 1, nama: "Super Top", harga: 350000, tipe: "First Class", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500" },
    { id: 2, nama: "Executive Plus", harga: 275000, tipe: "Executive", img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500" }
];

let keranjang = [];
let busAktif = null;
let kursiTerpilih = [];

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('nav-' + (id === 'pilihan-bis' ? 'pilihan' : id)).classList.add('active');
}

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const list = document.getElementById('bus-list');
    list.innerHTML = '';
    dataBus.forEach(bus => {
        list.innerHTML += `
            <div class="bus-card">
                <img src="${bus.img}">
                <div class="bus-info">
                    <h4>${bus.nama}</h4><p>${bus.tipe}</p>
                    <div class="price">Rp ${bus.harga.toLocaleString()}</div>
                    <button class="btn-checkout" onclick="bukaModal(${bus.id})">PILIH KURSI</button>
                </div>
            </div>`;
    });
    showSection('pilihan-bis');
});

function bukaModal(id) {
    busAktif = dataBus.find(b => b.id === id);
    kursiTerpilih = [];
    const container = document.getElementById('seats-container');
    container.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const s = document.createElement('div');
        s.className = 'seat';
        s.innerText = i;
        s.onclick = () => {
            if(kursiTerpilih.includes(i)) {
                kursiTerpilih = kursiTerpilih.filter(x => x !== i);
                s.classList.remove('selected');
            } else {
                kursiTerpilih.push(i);
                s.classList.add('selected');
            }
            document.getElementById('selected-seat-display').innerText = kursiTerpilih.join(', ') || '-';
            document.getElementById('confirm-seat-btn').disabled = !kursiTerpilih.length;
        };
        container.appendChild(s);
    }
    document.getElementById('seat-modal').style.display = 'block';
}

function closeSeatModal() { document.getElementById('seat-modal').style.display = 'none'; }

function konfirmasiKursi() {
    kursiTerpilih.forEach(k => {
        keranjang.push({ ...busAktif, kursi: k, asal: document.getElementById('asal').value, tujuan: document.getElementById('tujuan').value, tgl: document.getElementById('tanggal').value });
    });
    updateCart();
    closeSeatModal();
    showSection('keranjang');
}

function updateCart() {
    document.getElementById('cart-count').innerText = keranjang.length;
    const list = document.getElementById('cart-items');
    if(!keranjang.length) {
        list.innerHTML = '<p>Kosong</p>';
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }
    document.getElementById('cart-summary').style.display = 'block';
    list.innerHTML = keranjang.map((item, index) => `
        <div class="cart-item">
            <span>${item.nama} (Kursi ${item.kursi})</span>
            <button onclick="hapusItem(${index})" style="border:none; color:red; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>`).join('');
    const total = keranjang.reduce((s,i) => s + i.harga, 0);
    document.getElementById('total-price').innerText = `Rp ${total.toLocaleString()}`;
}

function hapusItem(index) {
    if(confirm("Hapus tiket?")) { keranjang.splice(index, 1); updateCart(); }
}

function kirimPesan() { alert("Pesan terkirim!"); document.getElementById('form-pesan').reset(); }

function prosesCheckout() {
    alert("Berhasil! Tiket didownload.");
    downloadPDF();
    keranjang = []; updateCart(); showSection('home');
}

function downloadPDF() {
    const content = `<h2>TIKET ROSALIA BUS</h2><p>Total Tiket: ${keranjang.length}</p>`;
    document.getElementById('print-content').innerHTML = content;
    html2pdf().from(document.getElementById('ticket-container')).save('Tiket.pdf');
}