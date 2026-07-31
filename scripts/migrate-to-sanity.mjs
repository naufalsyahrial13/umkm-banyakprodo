import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'

const umkmData = JSON.parse(readFileSync('./src/data/umkm.json', 'utf-8'))

const client = createClient({
  projectId: 'qxc24ijx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function migrate() {
  for (const item of umkmData) {
    const doc = {
      _id: `umkm-${item.id}`,
      _type: 'umkm',
      nama: item.nama,
      slug: {_type: 'slug', current: item.id},
      kategori: item.kategori,
      pemilik: item.pemilik,
      telepon: item.telepon,
      harga: item.harga,
      deskripsi: item.deskripsi,
      halal: item.halal,
      nib: item.nib,
      nomorNib: item.nomorNib,
      maps: item.maps || undefined,
      instagram: item.instagram,
      facebook: item.facebook,
      tiktok: item.tiktok,
      video: item.video || undefined,
      dusun: item.dusun,
      alamatDetail: item.alamatDetail,
      jamOperasional: item.jamOperasional,
      pembayaran: item.pembayaran,
    }
    const result = await client.createOrReplace(doc)
    console.log(`✔ Berhasil: ${result.nama}`)
  }
  console.log('Selesai! Semua UMKM sudah masuk ke Sanity.')
}

migrate().catch((err) => console.error('Gagal:', err))