// Next.js version of Speakers migrated from Vite
'use client';
import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, Plus, User, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  email: string;
  phone: string;
  expertise: string[];
  avatar: string;
}

const Speakers: React.FC = () => {
  const router = useRouter();
  const [speakers, setSpeakers] = useState<Speaker[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Chief Technology Officer',
      company: 'TechInnovate Inc.',
      bio: 'Leading expert in AI and machine learning with 15+ years experience',
      email: 'sarah@techinnovate.com',
      phone: '+1 (555) 123-4567',
      expertise: ['AI', 'Machine Learning', 'Data Science'],
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Mark Wilson',
      title: 'Startup Founder',
      company: 'NextGen Solutions',
      bio: 'Serial entrepreneur and mentor, founded 3 successful startups',
      email: 'mark@nextgen.com',
      phone: '+1 (555) 987-6543',
      expertise: ['Entrepreneurship', 'Business Strategy', 'Leadership'],
      avatar: '/placeholder.svg'
    }
  ]);

  const [newSpeaker, setNewSpeaker] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    expertise: ''
  });

  const handleAddSpeaker = () => {
    if (newSpeaker.name && newSpeaker.email) {
      const speaker: Speaker = {
        id: Date.now().toString(),
        name: newSpeaker.name,
        title: newSpeaker.title,
        company: newSpeaker.company,
        bio: newSpeaker.bio,
        email: newSpeaker.email,
        phone: newSpeaker.phone,
        expertise: newSpeaker.expertise.split(',').map(e => e.trim()),
        avatar: '/placeholder.svg'
      };
      setSpeakers([...speakers, speaker]);
      setNewSpeaker({ name: '', title: '', company: '', bio: '', email: '', phone: '', expertise: '' });
    }
  };

  const handleDeleteSpeaker = (id: string) => {
    setSpeakers(speakers.filter(speaker => speaker.id !== id));
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
          <h1 className="text-3xl font-bold">Speaker Management</h1>
        </div>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manage">Manage Speakers</TabsTrigger>
            <TabsTrigger value="add">Add New Speaker</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <div className="grid gap-4">
              {speakers.map((speaker) => (
                <Card key={speaker.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">{speaker.name}</h3>
                          <p className="text-gray-600">{speaker.title} at {speaker.company}</p>
                          <p className="text-sm text-gray-500">{speaker.bio}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {speaker.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {speaker.phone}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {speaker.expertise.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
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
                          onClick={() => handleDeleteSpeaker(speaker.id)}
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
                <CardTitle>Add New Speaker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="speakerName">Full Name</Label>
                    <Input
                      id="speakerName"
                      value={newSpeaker.name}
                      onChange={(e) => setNewSpeaker({...newSpeaker, name: e.target.value})}
                      placeholder="Dr. Sarah Johnson"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speakerTitle">Job Title</Label>
                    <Input
                      id="speakerTitle"
                      value={newSpeaker.title}
                      onChange={(e) => setNewSpeaker({...newSpeaker, title: e.target.value})}
                      placeholder="Chief Technology Officer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speakerCompany">Company</Label>
                    <Input
                      id="speakerCompany"
                      value={newSpeaker.company}
                      onChange={(e) => setNewSpeaker({...newSpeaker, company: e.target.value})}
                      placeholder="TechInnovate Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speakerEmail">Email</Label>
                    <Input
                      id="speakerEmail"
                      type="email"
                      value={newSpeaker.email}
                      onChange={(e) => setNewSpeaker({...newSpeaker, email: e.target.value})}
                      placeholder="speaker@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speakerPhone">Phone</Label>
                    <Input
                      id="speakerPhone"
                      value={newSpeaker.phone}
                      onChange={(e) => setNewSpeaker({...newSpeaker, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speakerExpertise">Expertise (comma separated)</Label>
                    <Input
                      id="speakerExpertise"
                      value={newSpeaker.expertise}
                      onChange={(e) => setNewSpeaker({...newSpeaker, expertise: e.target.value})}
                      placeholder="AI, Machine Learning, Data Science"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speakerBio">Bio</Label>
                  <textarea
                    id="speakerBio"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    value={newSpeaker.bio}
                    onChange={(e) => setNewSpeaker({...newSpeaker, bio: e.target.value})}
                    placeholder="Speaker biography and achievements..."
                  />
                </div>
                <Button onClick={handleAddSpeaker} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Speaker
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Speaker Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Dr. Emily Chen</p>
                        <p className="text-sm text-gray-600">Invited 3 days ago</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Prof. Michael Brown</p>
                        <p className="text-sm text-gray-600">Invited 1 week ago</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Dr. Lisa Wang</p>
                        <p className="text-sm text-gray-600">Invited 2 weeks ago</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        Declined
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Speakers;
