import React, { useState, useRef, useEffect } from 'react';
import discoveriesService, { Discovery } from '../services/discoveriesService';

interface DiscoveriesDropdownProps {
  onSeeAllClick: () => void;
}

const DiscoveriesDropdown: React.FC<DiscoveriesDropdownProps> = ({ onSeeAllClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDiscoveries(discoveriesService.getLatestDiscoveries(3));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSeeAllClick = () => {
    setIsOpen(false);
    onSeeAllClick();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="nav-link hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Discoveries
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          role="menu"
          aria-label="Latest discoveries"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Latest Research Updates</h3>
            
            {discoveries.length > 0 ? (
              <div className="space-y-4">
                {discoveries.map((discovery) => (
                  <div key={discovery.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${discoveriesService.getEvidenceBadgeColor(discovery.evidenceType)}`}>
                          {discovery.evidenceType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${discoveriesService.getPeerReviewBadgeColor(discovery.isPeerReviewed)}`}>
                          {discovery.isPeerReviewed ? 'Peer-reviewed' : 'Preprint'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {discoveriesService.formatDate(discovery.date)}
                      </span>
                    </div>
                    
                    <a 
                      href={discovery.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline block mb-1"
                    >
                      {discovery.title}
                    </a>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      {discovery.takeaway}
                    </p>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Applies to:</strong> {discovery.appliesTo}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {discovery.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">No discoveries available yet.</p>
                <p className="text-sm text-gray-400">Check back soon for the latest research updates!</p>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={handleSeeAllClick}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                See all discoveries
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">
                Informational only — not medical advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveriesDropdown;

