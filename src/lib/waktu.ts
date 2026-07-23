export interface JamOperasional {
  buka: string;
  tutup: string;
  hariBuka: number[];
}

export interface StatusBuka {
  buka: boolean;
  label: string;
}

export function cekStatusBuka(jadwal?: JamOperasional): StatusBuka {
  if (!jadwal || !jadwal.hariBuka || !jadwal.buka || !jadwal.tutup) {
    return { buka: false, label: "Jam tidak tersedia" };
  }

  const now = new Date();
  const hariIni = now.getDay();

  if (!jadwal.hariBuka.includes(hariIni)) {
    return { buka: false, label: "Tutup Hari Ini" };
  }

  const [jamBuka, menitBuka] = jadwal.buka.split(":").map(Number);
  const [jamTutup, menitTutup] = jadwal.tutup.split(":").map(Number);
  const totalMenitSekarang = now.getHours() * 60 + now.getMinutes();
  const totalMenitBuka = jamBuka * 60 + menitBuka;
  const totalMenitTutup = jamTutup * 60 + menitTutup;

  const sedangBuka = totalMenitSekarang >= totalMenitBuka && totalMenitSekarang <= totalMenitTutup;

  return {
    buka: sedangBuka,
    label: sedangBuka ? `Buka · Tutup ${jadwal.tutup}` : "Tutup",
  };
}