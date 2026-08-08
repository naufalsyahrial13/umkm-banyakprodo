import { createClient } from '@sanity/client';

export interface UmkmItem {
  id: string;
  nama: string;
  kategori: string;
  pemilik: string;
  telepon: string;
  harga: string;
  deskripsi: string;
  halal: boolean;
  nib: boolean;
  nomorNib: string;
  galeri: string[];
  galeriThumb: string[];
  maps: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  video: string;
  dusun: string;
  alamatDetail: string;
  jamOperasional: {
    buka: string;
    tutup: string;
    hariBuka: number[];
  };
  pembayaran: {
    cash: boolean;
    qris: boolean;
    transfer: boolean;
  };
}

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

function resizeGambar(url: string, lebar: number, kualitas = 75): string {
  if (!url) return url;
  return `${url}?w=${lebar}&q=${kualitas}&auto=format&fit=max`;
}

// Versi lebih kecil khusus untuk thumbnail (card katalog, list kegiatan).
// Dipisah dari resizeGambar supaya gambar besar (detail) & kecil (grid) tidak saling menimpa.
function resizeThumb(url: string, lebar = 480, kualitas = 70): string {
  if (!url) return url;
  return `${url}?w=${lebar}&q=${kualitas}&auto=format&fit=max`;
}

const QUERY_ALL_UMKM = `*[_type == "umkm"] | order(nama asc) {
  "id": slug.current,
  nama,
  kategori,
  pemilik,
  telepon,
  harga,
  deskripsi,
  halal,
  nib,
  nomorNib,
  "galeri": galeri[].asset->url,
  maps,
  instagram,
  facebook,
  tiktok,
  video,
  dusun,
  alamatDetail,
  jamOperasional,
  pembayaran
}`;

export async function getUmkmData(): Promise<UmkmItem[]> {
  const data = await sanityClient.fetch<UmkmItem[]>(QUERY_ALL_UMKM);
  return data.map((item) => ({
    ...item,
    galeri: (item.galeri || []).map((url) => resizeGambar(url, 1200)),
    galeriThumb: (item.galeri || []).map((url) => resizeThumb(url, 480)),
  }));
}

export interface KegiatanItem {
  _id: string;
  slug: string;
  judul: string;
  tanggal: string;
  kategori: string;
  isi: string;
  foto: string | null;
  fotoThumb: string | null;
  penulis: string;
}

const QUERY_ALL_KEGIATAN = `*[_type == "kegiatan"] | order(tanggal desc) {
  _id,
  "slug": slug.current,
  judul,
  tanggal,
  kategori,
  isi,
  "foto": foto.asset->url,
  penulis
}`;

export async function getKegiatanData(): Promise<KegiatanItem[]> {
  const data = await sanityClient.fetch<KegiatanItem[]>(QUERY_ALL_KEGIATAN);
  return data.map((item) => ({
    ...item,
    foto: item.foto ? resizeGambar(item.foto, 900) : null,
    fotoThumb: item.foto ? resizeThumb(item.foto, 400) : null,
  }));
}

export interface InformasiItem {
  _id: string;
  slug: string;
  judul: string;
  kategori: string;
  isi: string;
  sumber: string | null;
}

const QUERY_ALL_INFORMASI = `*[_type == "informasi"] | order(kategori asc) {
  _id,
  "slug": slug.current,
  judul,
  kategori,
  isi,
  sumber
}`;

export async function getInformasiData(): Promise<InformasiItem[]> {
  return await sanityClient.fetch<InformasiItem[]>(QUERY_ALL_INFORMASI);
}