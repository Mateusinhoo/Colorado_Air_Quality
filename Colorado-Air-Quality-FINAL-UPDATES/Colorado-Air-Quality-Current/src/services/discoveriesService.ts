export interface Discovery {
  id: string;
  evidenceType: 'RCT' | 'Guideline' | 'Cohort' | 'Review' | 'Preprint';
  isPeerReviewed: boolean;
  date: string;
  title: string;
  takeaway: string;
  appliesTo: string;
  effectDirection: string;
  source: string;
  year: number;
  tags: string[];
  link: string;
  sourceOrganization: string;
}

class DiscoveriesService {
  private discoveries: Discovery[] = [
    {
      id: '1',
      evidenceType: 'Cohort',
      isPeerReviewed: true,
      date: '2023-06-07',
      title: 'Wildfire smoke → asthma ER surge (New York, June 2023)',
      takeaway: 'On the worst smoke day, New York saw a sharp increase in asthma emergency visits compared with early-June baseline.',
      appliesTo: 'People in smoke-affected areas; especially older children/young adults showed large relative jumps.',
      effectDirection: '↑ ER visits ~82% statewide on June 7 vs. June 1–5 baseline (largest relative rises among ages 10–29).',
      source: 'CDC MMWR',
      year: 2023,
      tags: ['Wildfires', 'PM2.5', 'Emergency care'],
      link: 'https://cdc.gov/mmwr/volumes/72/wr/mm7234a6.htm',
      sourceOrganization: 'CDC'
    },
    {
      id: '2',
      evidenceType: 'Review',
      isPeerReviewed: true,
      date: '2024-01-15',
      title: 'Cleaning indoor air (HEPA) → better asthma control',
      takeaway: 'Across multiple studies, running HEPA air cleaners in homes/classrooms reduced indoor PM2.5 and improved asthma symptoms/control when used consistently.',
      appliesTo: 'Children and adults with asthma in homes/classrooms with particulate pollution.',
      effectDirection: '↓ Indoor PM2.5; improved control/symptoms; lower exacerbation risk (magnitude varies by study/adherence).',
      source: 'Journal of Allergy and Clinical Immunology (JACI)',
      year: 2024,
      tags: ['HEPA', 'Indoor air', 'Home/Classroom'],
      link: 'https://jacionline.org/article/S0091-6749(24)00861-3/fulltext',
      sourceOrganization: 'JACI Online'
    },
    {
      id: '3',
      evidenceType: 'Guideline',
      isPeerReviewed: true,
      date: '2025-01-01',
      title: 'GINA 2025 strategy update → reliever and step-up guidance',
      takeaway: 'GINA 2025 reinforces anti-inflammatory reliever therapy (ICS–formoterol) for many patients and refines step-up treatment; adds clarity for younger children and biomarker-informed care.',
      appliesTo: 'Clinicians and patients using stepwise therapy (adolescents/adults; guidance for young children).',
      effectDirection: 'Emphasizes reduced severe exacerbations and lower steroid exposure vs SABA-only approaches.',
      source: 'Global Initiative for Asthma (GINA)',
      year: 2025,
      tags: ['Treatment', 'Guideline', 'ICS–formoterol'],
      link: 'https://ginasthma.org/2025-gina-strategy-report/',
      sourceOrganization: 'Global Initiative for Asthma - GINA'
    }
  ];

  getLatestDiscoveries(limit: number = 3): Discovery[] {
    return this.discoveries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  getAllDiscoveries(): Discovery[] {
    return this.discoveries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getDiscoveriesByEvidenceType(evidenceType: string): Discovery[] {
    if (evidenceType === 'All') return this.getAllDiscoveries();
    return this.discoveries.filter(d => d.evidenceType === evidenceType);
  }

  getDiscoveriesByTag(tag: string): Discovery[] {
    if (tag === 'All') return this.getAllDiscoveries();
    return this.discoveries.filter(d => d.tags.includes(tag));
  }

  getAllEvidenceTypes(): string[] {
    const types = new Set(this.discoveries.map(d => d.evidenceType));
    return ['All', ...Array.from(types)];
  }

  getAllTags(): string[] {
    const tags = new Set(this.discoveries.flatMap(d => d.tags));
    return ['All', ...Array.from(tags).sort()];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getEvidenceBadgeColor(evidenceType: string): string {
    switch (evidenceType) {
      case 'RCT': return 'bg-green-100 text-green-800';
      case 'Guideline': return 'bg-blue-100 text-blue-800';
      case 'Cohort': return 'bg-purple-100 text-purple-800';
      case 'Review': return 'bg-orange-100 text-orange-800';
      case 'Preprint': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPeerReviewBadgeColor(isPeerReviewed: boolean): string {
    return isPeerReviewed 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  }
}

export default new DiscoveriesService();

