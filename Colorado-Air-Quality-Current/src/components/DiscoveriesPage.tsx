import React, { useState, useEffect } from 'react';
import discoveriesService, { Discovery } from '../services/discoveriesService';

const DiscoveriesPage: React.FC = () => {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [filteredDiscoveries, setFilteredDiscoveries] = useState<Discovery[]>([]);
  const [selectedEvidenceType, setSelectedEvidenceType] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [evidenceTypes, setEvidenceTypes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const allDiscoveries = discoveriesService.getAllDiscoveries();
    setDiscoveries(allDiscoveries);
    setFilteredDiscoveries(allDiscoveries);
    setEvidenceTypes(discoveriesService.getAllEvidenceTypes());
    setTags(discoveriesService.getAllTags());
  }, []);

  useEffect(() => {
    let filtered = discoveries;
    
    if (selectedEvidenceType !== 'All') {
      filtered = filtered.filter(d => d.evidenceType === selectedEvidenceType);
    }
    
    if (selectedTag !== 'All') {
      filtered = filtered.filter(d => d.tags.includes(selectedTag));
    }
    
    setFilteredDiscoveries(filtered);
  }, [discoveries, selectedEvidenceType, selectedTag]);

  const handleEvidenceTypeChange = (evidenceType: string) => {
    setSelectedEvidenceType(evidenceType);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  const clearFilters = () => {
    setSelectedEvidenceType('All');
    setSelectedTag('All');
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Research Discoveries</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Stay informed with the latest credible asthma research findings from reputable sources. 
            We review and update this collection weekly, focusing on peer-reviewed studies from 
            leading medical journals and health organizations like CDC, NIH, GINA, NEJM, JAMA, and major medical societies.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Informational only — not medical advice. Talk to your clinician for personal guidance.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label htmlFor="evidence-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence Type
                </label>
                <select
                  id="evidence-type"
                  value={selectedEvidenceType}
                  onChange={(e) => handleEvidenceTypeChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {evidenceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <select
                  id="tags"
                  value={selectedTag}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(selectedEvidenceType !== 'All' || selectedTag !== 'All') && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDiscoveries.length} of {discoveries.length} discoveries
          </div>
        </div>

        {/* Discoveries List */}
        <div className="space-y-6">
          {filteredDiscoveries.length > 0 ? (
            filteredDiscoveries.map((discovery) => (
              <div key={discovery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${discoveriesService.getEvidenceBadgeColor(discovery.evidenceType)}`}>
                        {discovery.evidenceType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${discoveriesService.getPeerReviewBadgeColor(discovery.isPeerReviewed)}`}>
                        {discovery.isPeerReviewed ? 'Peer-reviewed' : 'Preprint'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {discoveriesService.formatDate(discovery.date)}
                      </span>
                    </div>
                    
                    <a 
                      href={discovery.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800 hover:underline block mb-3"
                    >
                      {discovery.title}
                    </a>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {discovery.takeaway}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Who it applies to:</h4>
                        <p className="text-sm text-gray-600">{discovery.appliesTo}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Effect direction/size:</h4>
                        <p className="text-sm text-gray-600">{discovery.effectDirection}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discovery.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <strong>Source:</strong> {discovery.source}, {discovery.year} | {discovery.sourceOrganization}
                    </div>
                  </div>
                  
                  <div className="lg:ml-6">
                    <a
                      href={discovery.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      Read full study
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discoveries found</h3>
              <p className="text-gray-500 mb-4">
                No research findings match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Our Sources</h3>
          <p className="text-sm text-gray-600 mb-4">
            We prioritize credible, peer-reviewed research from reputable sources including the CDC, NIH, 
            Global Initiative for Asthma (GINA), and leading medical journals such as NEJM, JAMA, 
            European Respiratory Journal, Thorax, and Journal of Allergy and Clinical Immunology. 
            When including preprints, they are clearly labeled and generally not featured in our top highlights 
            unless highly relevant to current events.
          </p>
          <p className="text-sm text-gray-600 font-medium">
            Informational only — not medical advice. Talk to your clinician for personal guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoveriesPage;

