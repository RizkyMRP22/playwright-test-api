export const ECOSYSTEM_DATA = [
    {
        "ecosystem": "Indibiz Agriculture",
        "subSector": ["Perikanan", "Pertanian"]
    },
    {
        "ecosystem": "Indibiz Ekspedisi",
        "subSector": ["Others"]
    },
    {
        "ecosystem": "Indibiz Energi",
        "subSector": ["Sub-Kon Tambang/Minyak Lokal"]
    },
    {
        "ecosystem": "Indibiz Government",
        "subSector": ["Kementrian BUMN", "Pemerintah"]
    },
    {
        "ecosystem": "Indibiz Health",
        "subSector": ["Apotek/Lab", "Klinik/Puskesmas", "Praktek Dokter/Bidan", "Rumah Sakit Lokal", "Rumah Sakit Vertikas/RSUP/RSUPN (Swasta)"]
    },
    {
        "ecosystem": "Indibiz Hotel",
        "subSector": ["Hotel non BUMN", "Objek Wisata", "Villa/Resort/Bungalow"]
    },
    {
        "ecosystem": "Indibiz Logisitik",
        "subSector": ["Transportasi Darat/Laut/Udara milik BUMN"]
    },
    {
        "ecosystem": "Indibiz Manufaktur",
        "subSector": ["Kontraktor Lokal", "Perusahaan Manufacture"]
    },
    {
        "ecosystem": "Indibiz Media & Komunikasi",
        "subSector": ["Event, Entertaiment & MICE", "Event, Entertainment & MICE", "Event, entertainment & MICE", "Percetakan/Advertising/Iklan/Digital Printing", "Stasiun Radio Lokal"]
    },
    {
        "ecosystem": "Indibiz Multifinance",
        "subSector": ["Bank Perkreditan Rakyat (BPR)", "Koperasi", "Leasing"]
    },
    {
        "ecosystem": "Indibiz Other",
        "subSector": ["Others"]
    },
    {
        "ecosystem": "Indibiz RUKO",
        "subSector": ["Bengkel/Jasa Perbaikan atau Service", "Car Wash", "Dealer/Distributor/Agen/Grosir", "Design Grafis/Interior/Studio Foto", "Konsultan dan Biro Jasa", "Laundry", "Minimarket", "Petshop", "Rumah Ibadah/Organisasi", "Rumah Makan/Cafe", "Salon/Makeup Artist/Spa", "Warnet/Game"]
    },
    {
        "ecosystem": "Indibiz Sekolah",
        "subSector": ["PTN, Sekolah Tinggi/Universitas Pertahanan", 
        "Pendidikan Dasar (TK/SD/SLB/PAUD)", 
        "Pendidikan Menengah (SMP/SMA/SMK)",
        "Pendidikan Tinggi (Akademi, Sekolah Tinggi/Universitas)"]
    }
];

export const expectedColors = {
    'Data Mentah': '#5A666D',
    'Scrapping Google': '#6A4800',
    'Proses Survey': '#535E98',
    'Assigned': '#535E98',
    'Proses Approval - POI Hasil Survei': '#535E98',
    'Proses Approval - POI Baru': '#535E98',
    'Invalid': '#6A4800',
    'Valid Mitra': '#157631',
    'Valid Internal': '#157631',
    'submitted': '#157631',
    'Valid': '#157631',
    'Not Found': '#C72037'
};

export const expectedStatus = [
    {
        key: 'dataMentah',
        value: "Data Mentah"
    },
    {
        key: 'prosesSurvei',
        value: 'Proses Survey'
    },
    {
        key: 'valid',
        value: 'valid'
    },
    {
        key: 'invalid',
        value:'Invalid'
    }
]

export const expectedOpportunities = [
    {
        id:3,
        name: 'Government',
        sector:[
            {
                "id": 173,
                "name": "Layanan Bisnis",
                "opportunityId": 3
            },
            {
                "id": 171,
                "name": "Education",
                "opportunityId": 3
            },
            {
                "id": 172,
                "name": "Kesehatan",
                "opportunityId": 3
            }
        ]
    },
    {
        id: 2,
        name: 'Enterprise',
        sector: [
            {
                "id": 156,
                "name": "Agrikultur & Perhutanan",
                "opportunityId": 2
            },
            {
                "id": 157,
                "name": "BUMN & BUMD",
                "opportunityId": 2
            },
            {
                "id": 158,
                "name": "Banking & Finance",
                "opportunityId": 2
            },
            {
                "id": 159,
                "name": "Education",
                "opportunityId": 2
            },
            {
                "id": 160,
                "name": "Financial Non Banking",
                "opportunityId": 2
            },
            {
                "id": 161,
                "name": "Hospitality, Parawisata & Welfare",
                "opportunityId": 2
            },
            {
                "id": 162,
                "name": "Infrastruktur & Properti",
                "opportunityId": 2
            },
            {
                "id": 163,
                "name": "Kesehatan",
                "opportunityId": 2
            },
            {
                "id": 164,
                "name": "Layanan Bisnis",
                "opportunityId": 2
            },
            {
                "id": 165,
                "name": "Layanan Profesional",
                "opportunityId": 2
            },
            {
                "id": 166,
                "name": "Manufaktur/Pabrik",
                "opportunityId": 2
            },
            {
                "id": 167,
                "name": "Perdagangan & Distribusi",
                "opportunityId": 2
            },
            {
                "id": 168,
                "name": "Pertambangan & Energi",
                "opportunityId": 2
            },
            {
                "id": 169,
                "name": "Retail & Distribusi",
                "opportunityId": 2
            },
            {
                "id": 170,
                "name": "Transportasi & Logistik",
                "opportunityId": 2
            }
        ]
    },
    {
        id: 1,
        name: 'Business Service',
        sector: [
            {
                "id": 107,
                "name": "Education",
                "opportunityId": 1
            },
            {
                "id": 141,
                "name": "Agrikultur & Perhutanan",
                "opportunityId": 1
            },
            {
                "id": 142,
                "name": "BUMN & BUMD",
                "opportunityId": 1
            },
            {
                "id": 143,
                "name": "Banking & Finance",
                "opportunityId": 1
            },
            {
                "id": 145,
                "name": "Financial non Banking",
                "opportunityId": 1
            },
            {
                "id": 146,
                "name": "Hospitality, Parawisata & Welfare",
                "opportunityId": 1
            },
            {
                "id": 147,
                "name": "Infrastruktur & Properti",
                "opportunityId": 1
            },
            {
                "id": 148,
                "name": "Kesehatan",
                "opportunityId": 1
            },
            {
                "id": 149,
                "name": "Layanan Bisnis",
                "opportunityId": 1
            },
            {
                "id": 150,
                "name": "Layanan Profesional",
                "opportunityId": 1
            },
            {
                "id": 151,
                "name": "Manufaktur/Pabrik",
                "opportunityId": 1
            },
            {
                "id": 152,
                "name": "Perdagangan & Distribusi",
                "opportunityId": 1
            },
            {
                "id": 153,
                "name": "Pertambangan & Energi",
                "opportunityId": 1
            },
            {
                "id": 154,
                "name": "Retail & Distribusi",
                "opportunityId": 1
            },
            {
                "id": 155,
                "name": "Transportasi & Logistik",
                "opportunityId": 1
            }
        ]
    }
];
