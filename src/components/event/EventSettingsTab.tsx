import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface EventType {
  key: string;
  name: string;
  tabs?: string[];
}

interface TabConfigItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  order: number;
}


interface EventSettingsTabProps {
  eventType: string;
  eventTypes: EventType[];
  handleEventTypeChange: (type: string) => void;
  tabConfigItems: TabConfigItem[];
  tabConfigLoading: boolean;
  tabSettings: Record<string, boolean>;
  handleTabSettingChange: (tab: string, enabled: boolean) => void;
  t: (key: string) => string;
  LucideIcons: typeof import('lucide-react');
}

const EventSettingsTab: React.FC<EventSettingsTabProps> = ({
  eventType,
  eventTypes,
  handleEventTypeChange,
  tabConfigItems,
  tabConfigLoading,
  tabSettings,
  handleTabSettingChange,
  t,
  LucideIcons
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LucideIcons.Settings className="h-5 w-5" />
          Event Settings
        </CardTitle>
        <CardDescription>
          Configure your event type and choose which tabs to display
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="event-type">Event Type</Label>
          <Select onValueChange={handleEventTypeChange} value={eventType}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(et => (
                <SelectItem key={et.key} value={et.key}>{et.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Tab Configuration</h3>
          {tabConfigLoading ? (
            <div className="text-gray-500">Loading tabs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tabConfigItems.map((item) => {
                const IconComponent = LucideIcons[item.icon] || LucideIcons.Settings;
                const isEnabled = tabSettings[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleTabSettingChange(item.key, !isEnabled)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                      ${isEnabled
                        ? 'border-purple-500 bg-purple-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${item.color} ${isEnabled ? 'opacity-100' : 'opacity-50'}`}> 
                        {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${isEnabled ? 'text-purple-900' : 'text-gray-900'}`}>
                          {t(item.title) || item.title}
                        </h4>
                        <p className={`text-xs mt-1 ${isEnabled ? 'text-purple-600' : 'text-gray-500'}`}>
                          {t(item.description) || item.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle indicator */}
                    <div className={`
                      absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all duration-200
                      ${isEnabled
                        ? 'bg-purple-500 border-purple-500'
                        : 'bg-white border-gray-300'
                      }
                    `}>
                      {isEnabled && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Select your event type to automatically configure the most relevant tabs. You can still customize them manually by clicking on the tiles above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSettingsTab;
