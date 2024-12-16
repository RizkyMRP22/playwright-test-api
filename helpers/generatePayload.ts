import { getDataFaker } from './faker';
const extractData = getDataFaker();

class PayloadRequest {
  // Earth's radius in meters
  static earthRadius = 6371000;

  // Generate random latitude and longitude within a given range in meters
  static generateRandomCoordinate(latitude: number, longitude: number, rangeMeters: number = 500): { latitude: number, longitude: number } {
    const angularDistance = rangeMeters / this.earthRadius;
    const randomAngle = Math.random() * 2 * Math.PI;

    const latOffset = angularDistance * Math.cos(randomAngle);
    const lonOffset = angularDistance * Math.sin(randomAngle) / Math.cos(latitude * Math.PI / 180);

    // Calculate new latitude and longitude
    let newLatitude = latitude + (latOffset * 180) / Math.PI;
    let newLongitude = longitude + (lonOffset * 180) / Math.PI;

    // Clamp latitude to ensure it is within the valid range
    newLatitude = Math.max(-90, Math.min(90, newLatitude));

    // Wrap longitude within -180 to 180
    if (newLongitude > 180) newLongitude -= 360;
    if (newLongitude < -180) newLongitude += 360;

    return { latitude: newLatitude, longitude: newLongitude };
  }

  static addNewPoi(payload: any) {
    const baseLatitude = -7.305260501068479;
    const baseLongitude = 108.22631835937501;
    const { latitude, longitude } = this.generateRandomCoordinate(baseLatitude, baseLongitude, 500);

    return {
      address: "Jl. Sukagenah No.45, Nagarasari, Kec. Cipedes, Kab. Tasikmalaya, Jawa Barat 46132, Indonesia",
      description: "test QA",
      buildType: "Ruko",
      latitude: latitude,
      longitude: longitude,
      name: extractData.poiName,
      ecosystem: payload.ecosystem,
      sectorId: payload.sectorId,
      sector: payload.sectorName,
      subsectorId: payload.subSectorId,
      subSector: payload.subSectorName,
      opportunityId: payload.opportunityId,
      opportunity: payload.opportunityName,
      photo:payload.photo
    };
  }

  static submitSurveyPoi(payload: any) {
    return {
      "identity": {
        "poiId": payload.poiId,
        "poiName": payload.poiName,
        "description": "Ini optional ya",
        "phoneNumber": "",
        "address": payload.address,
        "opportunityId": 3,
        "opportunity": "Government",
        "sectorId": 171,
        "sector": "Education",
        "subSectorId": 551,
        "subSector": "PTN, Sekolah Tinggi/Universitas Pertahanan",
        "indibizEcosystem": "Indibiz Sekolah",
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "buildingType": "Ruko"
      },
      "questionaire": {
        "mandatory": [
          {
            "questionId": 204,
            "question": "Nama Responden",
            "type": "text",
            "answer": {
              "value": "Qa"
            }
          },
          {
            "questionId": 205,
            "question": "Jabatan Responden",
            "type": "text",
            "answer": {
              "value": "Qa"
            }
          },
          {
            "questionId": 206,
            "question": "Jika berkenan, Berapakah Perkiraan Pemasukan Perbulan?",
            "type": "option-other",
            "options": [
              "Dibawah dari Rp 167 Juta",
              "Rp 167 Juta - Rp 1,25 Milyar",
              "Rp 1,25 Milyar - Rp 4,17 Milyar",
              "Lebih dari Rp 4,17",
              "Customer kurang mengetahui",
              "Others"
            ],
            "answer": {
              "value": "Rp 1,25 Miliar - Rp 4,17 Miliar",
              "otherValue": ""
            }
          },
          {
            "questionId": 207,
            "question": "Jika berkenan, kira-kira berapakah nilai aset dari perusahaan anda ?",
            "type": "option-other",
            "options": [
              "Kurang dari Rp 500 Juta",
              "Rp 501 Juta - Rp 2 Milliar",
              "Rp 2 Milliar - 5 Milliar",
              "Rp 5 Milliar - Rp 20 MIlliar",
              "Rp 20 Milliar - Rp 50 Milliar",
              "diatas Rp 50 Milliar",
              "Customer kurang mengetahui",
              "Others"
            ],
            "answer": {
              "value": "Di atas Rp 50 Milliar",
              "otherValue": ""
            }
          },
          {
            "questionId": 209,
            "question": "Berapakah Jumlah Pegawai dalam menjalankan Bisnis Saudara?",
            "type": "option",
            "options": [
              "< 5 Pegawai",
              "5 - 20 Pegawai",
              "20 - 50 Pegawai",
              "> 50 Pegawai"
            ],
            "answer": {
              "value": "20 - 50 Pegawai"
            }
          },
          {
            "questionId": 210,
            "question": "Apakah lokasi ini sudah berlangganan Internet?",
            "type": "option",
            "options": [
              "Yes",
              "No"
            ],
            "answer": {
              "value": "Tidak"
            }
          },
          {
            "questionId": 211,
            "question": "Provider yang digunakan ?",
            "type": "checkbox-other",
            "options": [
              "Telkom / Indihome / Indibiz",
              "Telkomsel / Orbit",
              "First Media",
              "MyRepublic",
              "MNC Play",
              "XL Home",
              "CBN",
              "Iconnet",
              "Biznet",
              "Oxygen",
              "Indovision / MNC Vision",
              "Transvision",
              "K–Vision",
              "Big TV",
              "Responden belum berlangganan internet",
              "Others"
            ],
            "answer": {
              "value": [
                "K-Vision",
                "Lainnya"
              ],
              "isOther": true,
              "otherValue": "Qa"
            }
          },
          {
            "questionId": 215,
            "question": "Berapa biaya maksimal yang mampu anda keluarkan untuk kebutuhan internet setiap bulan?",
            "type": "option",
            "options": [
              "Rp300.000 – Rp499.000",
              "Rp500.000 – Rp749.999",
              "Rp750.000 - Rp999.999",
              "Rp 1.000.000 - Rp 1.999.999",
              "Lebih dari Rp 2.000.000"
            ],
            "answer": {
              "value": "Rp 1.000.000 - Rp 1.999.999"
            }
          },
          {
            "questionId": 212,
            "question": "Apa kendala bisnis yang anda rasakan saat ini ?",
            "type": "text",
            "answer": {
              "value": "Tes ya"
            }
          },
          {
            "questionId": 213,
            "question": "Dalam menjalankan usaha, layanan Digital/ICT apa yang anda butuhkan?",
            "type": "checkbox-other",
            "options": [
              "Camera CCTV",
              "Cloud Storage (Penyimpanan Data di Cloud)",
              "IPTV (TV Berlangganan)",
              "Modem WiFi",
              "Network & Monitoring (Managed Wi-Fi)",
              "Paket iklan digital (google, social media)",
              "Sistem Kasir Digital (Kasir POS)",
              "Sistem Pembukuan Digital",
              "Keamanan Cyber (Cyber security)",
              "Others",
              "Descriptive"
            ],
            "answer": {
              "value": [
                "Keamanan Cyber (Cyber security)",
                "Sistem Pembukuan Digital"
              ]
            }
          },
          {
            "questionId": 214,
            "question": "Photo",
            "type": "image",
            "answer": {
              "value": [
                payload.photo
              ]
            }
          },
          {
            "questionId": 1111,
            "question": "Nomor Handphone",
            "type": "custom-text",
            "answer": {
              "value": "0"
            }
          }
        ],
        "preference": [
          {
            "questionId": 1,
            "type": "text",
            "question": "Bagaimana pola pembelian layanan internet dan komunikasi di kalangan masyarakat Balingka saat ini?",
            "context": "Pemahaman tentang pola pembelian ini penting untuk mengidentifikasi preferensi pelanggan dan merumuskan penawaran yang lebih tepat. Telkom dapat menggunakan data ini untuk menyesuaikan layanan Indibiz 2P agar lebih sesuai dengan kebutuhan masyarakat.",
            "answer": {
              "value": "Ok"
            }
          },
          {
            "questionId": 2,
            "type": "text",
            "question": "Apakah ada komunitas atau asosiasi tertentu di Balingka yang aktif dalam memanfaatkan teknologi digital?",
            "context": "Mengetahui identitas dan jaringan sosial pelanggan membantu dalam segmentasi yang lebih akurat dan komunikasi yang dipersonalisasi. Jika ada komunitas yang aktif, Telkom bisa menawarkan produk digital yang mendukung kegiatan mereka.",
            "answer": {
              "value": "Ok"
            }
          },
          {
            "questionId": 3,
            "type": "text",
            "question": "Layanan digital atau platform apa yang saat ini paling banyak digunakan oleh masyarakat di Balingka, dan apa tantangan yang mereka hadapi dalam mengakses layanan tersebut?",
            "context": "Dengan memahami layanan digital yang digunakan dan tantangan yang dihadapi, Telkom dapat mengembangkan solusi yang lebih efektif, seperti paket internet untuk UMKM yang dapat diakses oleh masyarakat di desa.",
            "answer": {
              "value": "Ok"
            }
          },
          {
            "questionId": 4,
            "type": "text",
            "question": "Sejauh mana pengetahuan masyarakat Balingka tentang konsep Smart-X, seperti smart city atau smart home?",
            "context": "Mengetahui tingkat pemahaman ini akan membantu Telkom dalam mengembangkan program edukasi dan solusi yang relevan, seperti memperkenalkan layanan IoT yang bisa meningkatkan kualitas hidup di desa melalui teknologi.",
            "answer": {
              "value": "Ok"
            }
          },
          {
            "questionId": 5,
            "type": "text",
            "question": "Keterangan Tambahan",
            "context": "",
            "answer": {
              "value": "Ok"
            }
          }
        ]
      },
      "poiActivity": {
        "isInterested": true,
        "activityType": "Survey",
        "activityStartDate": "2024-12-10T17:00:00.000Z",
        "activityEndDate": "2024-12-10T18:00:00.000Z",
        "activityNotes": `Testing automation test for activity ${extractData.randomNumber}`,
        "voiceCustomer": `Testing automation test for voice customer ${extractData.randomNumber}`,
        "activityFiles": [
            {
                "fileId": payload.fileId,
                "fileName": payload.fileName
            }
        ]
    }
    }
  }
}

export default PayloadRequest;
