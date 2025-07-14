import { useState, useEffect } from 'react';

interface CompanyData {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const useCompanyData = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        // In a real application, this would be fetched from an API
        // For now, we'll use mock data
        const mockCompanyData: CompanyData = {
          name: 'RDPR Company',
          logo: '/uploads/rdpr-logo.svg',
          address: '123 Business St, Suite 100, Business City, 12345',
          phone: '+1 (555) 123-4567',
          email: 'info@rdpr.example.com',
          social: {
            facebook: 'https://facebook.com/rdpr',
            twitter: 'https://twitter.com/rdpr',
            instagram: 'https://instagram.com/rdpr',
            linkedin: 'https://linkedin.com/company/rdpr',
          },
        };
        
        // Simulate API delay
        setTimeout(() => {
          setCompanyData(mockCompanyData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch company data'));
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  return { companyData, loading, error };
};

export default useCompanyData; 