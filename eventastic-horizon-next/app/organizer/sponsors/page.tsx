// Next.js version of Sponsors migrated from Vite
'use client';
import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, Plus, Building, Edit, Trash2, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Sponsor {
  id: string;
  name: string;
  tier: string;
  amount: number;
  logo: string;
  website: string;
  contact: string;
}

const Sponsors: React.FC = () => {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([
    { id: '1', name: 'TechCorp', tier: 'Gold', amount: 5000, logo: '/placeholder.svg', website: 'techcorp.com', contact: 'sponsor@techcorp.com' },
    { id: '2', name: 'InnovateLab', tier: 'Silver', amount: 3000, logo: '/placeholder.svg', website: 'innovatelab.com', contact: 'partnership@innovatelab.com' },
    { id: '3', name: 'StartupHub', tier: 'Bronze', amount: 1000, logo: '/placeholder.svg', website: 'startuphub.com', contact: 'events@startuphub.com' }
  ]);

  const [newSponsor, setNewSponsor] = useState({
    name: '',
    tier: 'Bronze',
    amount: '',
    website: '',
    contact: ''
  } as any);

  const handleAddSponsor = () => {
    if (newSponsor.name && newSponsor.amount) {
      const sponsor: Sponsor = {
        id: Date.now().toString(),
        name: newSponsor.name,
        tier: newSponsor.tier,
        amount: parseFloat(newSponsor.amount),
        logo: '/placeholder.svg',
        website: newSponsor.website,
        contact: newSponsor.contact
      };
      setSponsors([...sponsors, sponsor]);
      setNewSponsor({ name: '', tier: 'Bronze', amount: '', website: '', contact: '' });
    }
  };

  const handleDeleteSponsor = (id: string) => {
    setSponsors(sponsors.filter(sponsor => sponsor.id !== id));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'text-yellow-600 bg-yellow-50';
      case 'Silver': return 'text-gray-600 bg-gray-50';
      case 'Bronze': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/organizer/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Sponsor Management</h1>
        </div>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manage">Manage Sponsors</TabsTrigger>
            <TabsTrigger value="add">Add New Sponsor</TabsTrigger>
            <TabsTrigger value="tiers">Sponsorship Tiers</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <div className="grid gap-4">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">{sponsor.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(sponsor.tier)}`}>
                            {sponsor.tier} Sponsor
                          </span>
                          <div className="text-sm text-gray-600">
                            <p>Amount: ${sponsor.amount.toLocaleString()}</p>
                            <p>Website: {sponsor.website}</p>
                            <p>Contact: {sponsor.contact}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteSponsor(sponsor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Sponsor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorName">Company Name</Label>
                    <Input
                      id="sponsorName"
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                      placeholder="e.g., TechCorp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorTier">Sponsorship Tier</Label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={newSponsor.tier}
                      onChange={(e) => setNewSponsor({...newSponsor, tier: e.target.value})}
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorAmount">Sponsorship Amount ($)</Label>
                    <Input
                      id="sponsorAmount"
                      type="number"
                      value={newSponsor.amount}
                      onChange={(e) => setNewSponsor({...newSponsor, amount: e.target.value})}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorWebsite">Website</Label>
                    <Input
                      id="sponsorWebsite"
                      value={newSponsor.website}
                      onChange={(e) => setNewSponsor({...newSponsor, website: e.target.value})}
                      placeholder="company.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="sponsorContact">Contact Email</Label>
                    <Input
                      id="sponsorContact"
                      type="email"
                      value={newSponsor.contact}
                      onChange={(e) => setNewSponsor({...newSponsor, contact: e.target.value})}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
                <Button onClick={handleAddSponsor} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Sponsor
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => (
                <Card key={tier}>
                  <CardContent className="p-6 text-center">
                    <h3 className={`text-xl font-bold mb-2 ${getTierColor(tier)}`}>{tier}</h3>
                    <div className="space-y-2 text-sm">
                      <p>Logo placement</p>
                      <p>Event mentions</p>
                      <p>Networking access</p>
                      {tier === 'Platinum' && <p>Keynote opportunity</p>}
                      {(tier === 'Platinum' || tier === 'Gold') && <p>Premium booth</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Sponsors;
