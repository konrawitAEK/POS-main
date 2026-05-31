'use client'
import { useEffect, useState } from 'react'
import { categoryService, type Category } from '@/services/categoryService'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState(''); const [desc, setDesc] = useState('')

  const load = () => categoryService.getAll().then(setCategories).catch(() => {})
  useEffect(() => { load() }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await categoryService.create(name, desc); toast.success('เพิ่มแล้ว'); setName(''); setDesc(''); load() }
    catch { toast.error('มีหมวดหมู่นี้แล้ว') }
  }

  const remove = async (id: number) => {
    if (!confirm('ยืนยันการลบ?')) return
    await categoryService.remove(id); toast.success('ลบแล้ว'); load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">จัดการหมวดหมู่</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">เพิ่มหมวดหมู่ใหม่</h2>
          <form onSubmit={create} className="space-y-3">
            <input className="input" placeholder="ชื่อหมวดหมู่ *" value={name} onChange={e => setName(e.target.value)} required />
            <input className="input" placeholder="คำอธิบาย" value={desc} onChange={e => setDesc(e.target.value)} />
            <button type="submit" className="btn-primary flex items-center gap-2"><FiPlus />เพิ่ม</button>
          </form>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4">หมวดหมู่ทั้งหมด ({categories.length})</h2>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="font-medium">{c.name}</p>{c.description && <p className="text-xs text-gray-500">{c.description}</p>}</div>
                <button onClick={() => remove(c.id)} className="text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
