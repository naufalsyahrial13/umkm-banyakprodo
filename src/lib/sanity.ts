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
  return await sanityClient.fetch<UmkmItem[]>(QUERY_ALL_UMKM);
}
export interface KegiatanItem {
  _id: string;
  judul: string;
  tanggal: string;
  kategori: string;
  isi: string;
  foto: string | null;
  penulis: string;
}

const QUERY_ALL_KEGIATAN = `*[_type == "kegiatan"] | order(tanggal desc) {
  _id,
  judul,
  tanggal,
  kategori,
  isi,
  "foto": foto.asset->url,
  penulis
}`;

export async function getKegiatanData(): Promise<KegiatanItem[]> {
  return await sanityClient.fetch<KegiatanItem[]>(QUERY_ALL_KEGIATAN);
}

export interface InformasiItem {
  _id: string;
  judul: string;
  kategori: string;
  isi: string;
  sumber: string | null;
}

const QUERY_ALL_INFORMASI = `*[_type == "informasi"] | order(kategori asc) {
  _id,
  judul,
  kategori,
  isi,
  sumber
}`;

export async function getInformasiData(): Promise<InformasiItem[]> {
  return await sanityClient.fetch<InformasiItem[]>(QUERY_ALL_INFORMASI);
}