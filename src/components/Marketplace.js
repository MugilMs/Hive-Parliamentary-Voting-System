import React, { useState, useEffect } from 'react';

const Marketplace = ({ username }) => {
  const [services, setServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'legislative', name: 'Legislative Drafting' },
    { id: 'analysis', name: 'Policy Analysis' },
    { id: 'consultation', name: 'Legal Consultation' },
    { id: 'premium', name: 'Premium Features' },
    { id: 'advertisement', name: 'Advertisement Slots' }
  ];
  
  // Mock data for marketplace services - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    
    const mockServices = [
      {
        id: 1,
        title: 'Professional Proposal Drafting',
        description: 'Have our legal experts draft your legislative proposal with professional language and formatting. Includes legal review and optimization for voting success.',
        price: 50,
        currency: 'HIVE',
        category: 'legislative',
        image: 'https://img.freepik.com/free-photo/law-concept-with-wooden-gavel_23-2149925586.jpg?size=626&ext=jpg',
        featured: true,
        platformFee: 10, // 10% platform fee
      },
      {
        id: 2,
        title: 'Premium Verification Badge',
        description: 'Get a verified badge next to your name to increase trust in your proposals. Valid for 3 months with priority listing in search results.',
        price: 100,
        currency: 'HIVE',
        category: 'premium',
        image: 'https://img.freepik.com/free-vector/gradient-check-mark_78370-426.jpg?size=626&ext=jpg',
        featured: false,
        platformFee: 20, // 20% platform fee
      },
      {
        id: 3,
        title: 'Policy Impact Analysis',
        description: 'Our experts will analyze your proposed legislation and provide a detailed report on potential economic, social, and political impacts.',
        price: 75,
        currency: 'HIVE',
        category: 'analysis',
        image: 'https://img.freepik.com/free-photo/business-person-analyzing-growing-chart_53876-23427.jpg?size=626&ext=jpg',
        featured: true,
        platformFee: 15, // 15% platform fee
      },
      {
        id: 4,
        title: 'Sponsored Proposal Placement',
        description: 'Have your proposal featured at the top of Active Proposals for 7 days for maximum visibility and voting potential.',
        price: 150,
        currency: 'HIVE',
        category: 'advertisement',
        image: 'https://img.freepik.com/free-vector/advertisement-concept-illustration_114360-1157.jpg?size=626&ext=jpg',
        featured: true,
        platformFee: 25, // 25% platform fee
      },
      {
        id: 5,
        title: 'Legal Compliance Review',
        description: 'Our legal team will review your proposal to ensure it complies with all relevant laws and regulations before submission.',
        price: 60,
        currency: 'HIVE',
        category: 'consultation',
        image: 'https://img.freepik.com/free-photo/close-up-lawyer-reading-legal-contract_53876-15989.jpg?size=626&ext=jpg',
        featured: false,
        platformFee: 12, // 12% platform fee
      },
      {
        id: 6,
        title: 'Proposal Marketing Campaign',
        description: 'Promote your proposal with a comprehensive marketing campaign including social media, email newsletters, and on-platform advertising.',
        price: 200,
        currency: 'HIVE',
        category: 'advertisement',
        image: 'https://img.freepik.com/free-photo/marketing-strategy-diagram-concept_53876-167088.jpg?size=626&ext=jpg',
        featured: false,
        platformFee: 20, // 20% platform fee
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setServices(mockServices);
      setFeaturedServices(mockServices.filter(service => service.featured));
      setIsLoading(false);
    }, 800);
  }, []);
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);
  
  const handlePurchase = (service) => {
    if (!username) {
      alert('Please log in to purchase services');
      return;
    }
    
    // Calculate total with platform fee
    const platformFeeAmount = (service.price * service.platformFee) / 100;
    const totalAmount = service.price + platformFeeAmount;
    
    const confirmMessage = `
      You are about to purchase:
      ${service.title}
      Price: ${service.price} ${service.currency}
      Platform Fee (${service.platformFee}%): ${platformFeeAmount} ${service.currency}
      Total: ${totalAmount} ${service.currency}
      
      Proceed with purchase?
    `;
    
    if (window.confirm(confirmMessage)) {
      alert(`Thank you for your purchase! Your service will be activated shortly.`);
      // In a real app, this would initiate a Hive blockchain transaction
    }
  };
  
  // Platform revenue stats - these would be calculated from actual transactions in a real app
  const revenueStats = {
    totalRevenue: 1250,
    thisMonth: 320,
    pendingPayout: 180,
    averageFee: 18 // percentage
  };
  
  return (
    <div className="marketplace-container">
      <div className="section-header">
        <h2>Marketplace</h2>
        <p className="section-description">Purchase premium services to enhance your legislative proposals</p>
      </div>
      
      {username && (
        <div className="platform-revenue">
          <h3>Platform Revenue Stats</h3>
          <div className="revenue-stats">
            <div className="revenue-stat-item">
              <div className="stat-value">{revenueStats.totalRevenue} HIVE</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="revenue-stat-item">
              <div className="stat-value">{revenueStats.thisMonth} HIVE</div>
              <div className="stat-label">This Month</div>
            </div>
            <div className="revenue-stat-item">
              <div className="stat-value">{revenueStats.pendingPayout} HIVE</div>
              <div className="stat-label">Pending Payout</div>
            </div>
            <div className="revenue-stat-item">
              <div className="stat-value">{revenueStats.averageFee}%</div>
              <div className="stat-label">Average Fee</div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Loading marketplace services...</p>
        </div>
      ) : (
        <>
          {featuredServices.length > 0 && (
            <div className="featured-services">
              <h3>Featured Services</h3>
              <div className="featured-services-grid">
                {featuredServices.map(service => (
                  <div key={service.id} className="featured-service-card">
                    <div className="featured-badge">Featured</div>
                    <img src={service.image} alt={service.title} className="service-image" />
                    <h4>{service.title}</h4>
                    <p className="service-price">{service.price} {service.currency}</p>
                    <button 
                      className="purchase-button" 
                      onClick={() => handlePurchase(service)}
                    >
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="service-categories">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="services-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <div key={service.id} className="service-card">
                  <img src={service.image} alt={service.title} className="service-image" />
                  <div className="service-content">
                    <h4>{service.title}</h4>
                    <p className="service-description">{service.description}</p>
                    <div className="service-footer">
                      <span className="service-price">{service.price} {service.currency}</span>
                      <button 
                        className="purchase-button" 
                        onClick={() => handlePurchase(service)}
                      >
                        Purchase
                      </button>
                    </div>
                    <div className="service-fee">
                      <small>Includes {service.platformFee}% platform fee</small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-services">
                <p>No services found in this category.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace; 