import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Edit } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

interface Category {
  id: string;
  name: string;
}

const CategoryAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() })
    });
    if (res.ok) {
      const created = await res.json();
      setCategories([...categories, created]);
      setNewCategory('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCategories(categories.filter(c => c.id !== id));
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;
    const res = await fetch(`${API_URL}/categories/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() })
    });
    if (res.ok) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, name: editingName.trim() } : c));
      setEditingId(null);
      setEditingName('');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4">
          <AdminSidebar />
        </aside>
        <main className="w-full md:w-3/4">
          <Card className="w-full mt-8">
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" />
                <Button onClick={handleAdd} variant="default"><Plus /></Button>
              </div>
              <ul className="divide-y">
                {categories.map(cat => (
                  <li key={cat.id} className="flex items-center gap-2 py-2">
                    {editingId === cat.id ? (
                      <>
                        <Input value={editingName} onChange={e => setEditingName(e.target.value)} className="w-40" />
                        <Button onClick={handleUpdate} size="sm" variant="default">Save</Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{cat.name}</span>
                        <Button onClick={() => handleEdit(cat)} size="icon" variant="ghost"><Edit /></Button>
                        <Button onClick={() => handleDelete(cat.id)} size="icon" variant="destructive"><Trash2 /></Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </MainLayout>
  );
};

export default CategoryAdmin;
