import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabConfigItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  order: number;
}

interface TabNavigationProps {
  tabConfigItems: TabConfigItem[];
  tabSettings: Record<string, boolean>;
  t: (key: string) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabConfigItems, tabSettings, t, activeTab, setActiveTab }) => {
  return (
    <TabsList className="flex w-full flex-nowrap overflow-x-auto gap-1 bg-white/90 border-b border-gray-200">
      <TabsTrigger value="settings" className="min-w-[64px] px-0.5 md:min-w-[160px] md:px-6 whitespace-nowrap" onClick={() => setActiveTab('settings')}>
        {t('organizer.tabs.settings') || 'Settings'}
      </TabsTrigger>
      <TabsTrigger value="basic" className="min-w-[64px] px-0.5 md:min-w-[160px] md:px-6 whitespace-nowrap" onClick={() => setActiveTab('basic')}>
        {t('organizer.tabs.basic')}
      </TabsTrigger>
      {/* Render dynamic tabs based on tabConfigItems and tabSettings */}
      {tabConfigItems.map(item => {
        const isEnabled = tabSettings[item.key];
        if (!isEnabled) return null;
        return (
          <TabsTrigger
            key={item.key}
            value={item.key}
            className="min-w-[64px] px-0.5 md:min-w-[160px] md:px-6 whitespace-nowrap"
            onClick={() => setActiveTab(item.key)}
          >
            {t(item.title) || item.title}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default TabNavigation;
