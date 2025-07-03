import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function TabConfigAdmin() {
  const [tabs, setTabs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    key: '',
    title: '',
    description: '',
    icon: '',
    color: '',
    order: 0,
    isEnabled: true,
  });

  useEffect(() => {
    fetch(`${API_URL}/tab-configs`).then(r => r.json()).then(setTabs);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = tab => {
    setEditing(tab.id);
    setForm(tab);
  };

  const handleDelete = async id => {
    await fetch(`${API_URL}/tab-configs/${id}`, { method: 'DELETE' });
    setTabs(tabs.filter(t => t.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await fetch(`${API_URL}/tab-configs/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setTabs(tabs.map(t => (t.id === editing ? { ...form, id: editing } : t)));
      setEditing(null);
    } else {
      const res = await fetch(`${API_URL}/tab-configs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newTab = await res.json();
      setTabs([...tabs, newTab]);
    }
    setForm({ key: '', title: '', description: '', icon: '', color: '', order: 0, isEnabled: true });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Tab Configuration</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div className="flex gap-2">
                <Input name="key" value={form.key} onChange={handleChange} placeholder="Key (e.g. tickets)" required />
                <Input name="title" value={form.title} onChange={handleChange} placeholder="Title (translation key)" required />
                <Input name="description" value={form.description} onChange={handleChange} placeholder="Description (translation key)" required />
              </div>
              <div className="flex gap-2">
                <Input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (e.g. Ticket)" required />
                <Input name="color" value={form.color} onChange={handleChange} placeholder="Color class (e.g. bg-purple-500)" required />
                <Input name="order" type="number" value={form.order} onChange={handleChange} placeholder="Order" />
                <label className="flex items-center gap-1">
                  <input type="checkbox" name="isEnabled" checked={form.isEnabled} onChange={handleChange} /> Enabled
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? 'Update' : 'Add'} Tab</Button>
                {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ key: '', title: '', description: '', icon: '', color: '', order: 0, isEnabled: true }); }}>Cancel</Button>}
              </div>
            </form>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Key</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Icon</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Order</th>
                  <th className="p-2">Enabled</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tabs.map(tab => (
                  <tr key={tab.id} className="border-t">
                    <td className="p-2">{tab.key}</td>
                    <td className="p-2">{tab.title}</td>
                    <td className="p-2">{tab.description}</td>
                    <td className="p-2">{tab.icon}</td>
                    <td className="p-2">{tab.color}</td>
                    <td className="p-2">{tab.order}</td>
                    <td className="p-2">{tab.isEnabled ? 'Yes' : 'No'}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(tab)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(tab.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
