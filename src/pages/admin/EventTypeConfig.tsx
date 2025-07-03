import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/useLanguage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

export default function EventTypeConfig() {
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [tabConfigs, setTabConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ key: '', name: '', description: '', tabs: [] as string[] });
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`${API_URL}/event-types`).then(r => r.json()).then(setEventTypes);
    fetch(`${API_URL}/tab-configs`).then(r => r.json()).then(data => setTabConfigs(data.filter((t:any)=>t.isEnabled)));
    setLoading(false);
  }, [editing]);

  const handleEdit = (et: any) => {
    setEditing(et);
    setForm({ key: et.key, name: et.name, description: et.description, tabs: et.tabs || [] });
  };
  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/event-types/${id}`, { method: 'DELETE' });
    setEditing(null);
    setEventTypes(eventTypes.filter(e => e.id !== id));
  };
  const handleSave = async () => {
    if (editing) {
      await fetch(`${API_URL}/event-types/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API_URL}/event-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setForm({ key: '', name: '', description: '', tabs: [] });
    const ets = await fetch(`${API_URL}/event-types`).then(r => r.json());
    setEventTypes(ets);
  };
  const handleCancel = () => {
    setEditing(null);
    setForm({ key: '', name: '', description: '', tabs: [] });
  };
  const handleTabChange = (tabKey: string, checked: boolean) => {
    setForm(f => ({ ...f, tabs: checked ? [...f.tabs, tabKey] : f.tabs.filter(t => t !== tabKey) }));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-3/4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Event Type Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Key</Label>
                    <Input value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))} required disabled={!!editing} />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div>
                  <Label>Tabs for this Event Type</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {tabConfigs.map(tab => (
                      <label key={tab.key} className="flex items-center gap-2">
                        <Checkbox checked={form.tabs.includes(tab.key)} onCheckedChange={checked => handleTabChange(tab.key, !!checked)} />
                        {t(tab.title) || tab.title}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                  {editing && <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Types List</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left border">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Key</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Tabs</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventTypes.map(et => (
                    <tr key={et.id} className="border-b">
                      <td className="p-2">{et.key}</td>
                      <td className="p-2">{et.name}</td>
                      <td className="p-2">{et.description}</td>
                      <td className="p-2 text-xs">{(et.tabs || []).join(', ')}</td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(et)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(et.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
