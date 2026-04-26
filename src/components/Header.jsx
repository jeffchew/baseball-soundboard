import { useState } from 'react';
import audioEngine from '../utils/audioEngine';

export default function Header({ activeTab, setActiveTab }) {
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitialize = async () => {
    const success = await audioEngine.initialize();
    if (success) {
      setIsInitialized(true);
    }
  };

  const tabs = [
    { id: 'lineup', label: 'Lineup' },
    { id: 'soundboard', label: 'Soundboard' },
    { id: 'music', label: 'Music' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-yankee-navy border-b-2 border-yankee-slate shadow-lg">
      <div className="px-4 py-3">
        {/* Initialize Button */}
        {!isInitialized && (
          <div className="mb-3">
            <button
              onClick={handleInitialize}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
            >
              🔊 Initialize Audio (iPhone Users)
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 font-bold rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-yankee-navy shadow-lg'
                  : 'bg-yankee-slate text-white hover:bg-yankee-gray'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// Made with Bob
