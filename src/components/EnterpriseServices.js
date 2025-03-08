import React, { useState, useEffect, useRef } from 'react';

const EnterpriseServices = ({ username }) => {
  const [activeTab, setActiveTab] = useState('verification');
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    service: 'verification',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const contactFormRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleContactClick = (service) => {
    setFormData({...formData, service});
    setContactFormVisible(true);
    setNeedsScroll(true); // Set flag to scroll after render
  };

  // Effect to handle scrolling after render when the contact form becomes visible
  useEffect(() => {
    if (contactFormVisible && needsScroll && contactFormRef.current) {
      contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
      setNeedsScroll(false); // Reset flag after scrolling
    }
  }, [contactFormVisible, needsScroll]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the data to a backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setContactFormVisible(false);
      setFormData({
        name: '',
        organization: '',
        email: '',
        service: 'verification',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="enterprise-services">
      <div className="section-header">
        <h2>Enterprise Solutions</h2>
        <p className="section-description">Premium services to enhance governance, transparency, and legislative efficiency</p>
      </div>

      <div className="services-tabs">
        <button 
          className={`service-tab ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => handleTabChange('verification')}
        >
          Verification & Certification
        </button>
        <button 
          className={`service-tab ${activeTab === 'premium' ? 'active' : ''}`}
          onClick={() => handleTabChange('premium')}
        >
          Premium Features
        </button>
        <button 
          className={`service-tab ${activeTab === 'licensing' ? 'active' : ''}`}
          onClick={() => handleTabChange('licensing')}
        >
          Licensing & White-Label
        </button>
      </div>

      <div className="services-content">
        {activeTab === 'verification' && (
          <div className="service-category">
            <h3>Verification & Certification Services</h3>
            <p className="service-description">
              Ensure the highest levels of trust and compliance with our verification and certification services, 
              specifically designed for governmental and regulatory bodies.
            </p>

            <div className="service-cards">
              <div className="service-card">
                <div className="service-card-header">
                  <h4>Blockchain Verification</h4>
                  <span className="service-price">50-250 HIVE per verification</span>
                </div>
                <p>Advanced cryptographic verification of critical legislative decisions with permanent blockchain records and tamper-proof certificates.</p>
                <ul className="service-features">
                  <li>Cryptographic proof of voting records</li>
                  <li>Tamper-evident certification</li>
                  <li>Public verification portal</li>
                  <li>Digital verification certificates</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('blockchain-verification')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>Regulatory Compliance</h4>
                  <span className="service-price">50-150 HIVE annually</span>
                </div>
                <p>Comprehensive compliance certification ensuring your voting processes meet all relevant regulatory requirements and standards.</p>
                <ul className="service-features">
                  <li>Compliance documentation</li>
                  <li>Quarterly compliance audits</li>
                  <li>Regulatory update notifications</li>
                  <li>Compliance reporting dashboard</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('compliance-certification')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>Digital Authentication</h4>
                  <span className="service-price">250-750 HIVE annually</span>
                </div>
                <p>Secure digital signature and authentication services for members, ensuring identity verification and access control.</p>
                <ul className="service-features">
                  <li>Multi-factor authentication</li>
                  <li>Biometric verification options</li>
                  <li>Digital signature infrastructure</li>
                  <li>Identity management system</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('digital-authentication')}>
                  Request Information
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="service-category">
            <h3>Premium Features & Add-ons</h3>
            <p className="service-description">
              Enhance your parliamentary voting system with powerful analytics, public transparency tools, and advanced integrations.
            </p>

            <div className="service-cards">
              <div className="service-card">
                <div className="service-card-header">
                  <h4>Analytics Package</h4>
                  <span className="service-price">25-100 HIVE/month</span>
                </div>
                <p>Advanced analysis of voting patterns, member participation, and legislative trends with interactive dashboards.</p>
                <ul className="service-features">
                  <li>Voting pattern visualization</li>
                  <li>Member participation metrics</li>
                  <li>Coalition analysis</li>
                  <li>Legislative effectiveness scoring</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('analytics-package')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>Public Transparency Portal</h4>
                  <span className="service-price">50-150 HIVE/month</span>
                </div>
                <p>Citizen-facing portal allowing the public to view, track, and analyze legislative voting in an accessible format.</p>
                <ul className="service-features">
                  <li>Public voting record access</li>
                  <li>Representative performance metrics</li>
                  <li>Legislative tracking tools</li>
                  <li>Constituency engagement features</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('transparency-portal')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>API Integration</h4>
                  <span className="service-price">100-250 HIVE/month</span>
                </div>
                <p>Comprehensive API access for integrating TransparenSee with existing systems, databases, and third-party applications.</p>
                <ul className="service-features">
                  <li>RESTful API endpoints</li>
                  <li>Webhook support</li>
                  <li>Custom data integration</li>
                  <li>Developer support</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('api-access')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>Custom Reporting</h4>
                  <span className="service-price">150-500 HIVE per report</span>
                </div>
                <p>Tailored reports for specific insights, compliance requirements, or stakeholder communications.</p>
                <ul className="service-features">
                  <li>Custom report design</li>
                  <li>Multiple export formats</li>
                  <li>Automated scheduling</li>
                  <li>White-labeled presentation</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('custom-reporting')}>
                  Request Information
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'licensing' && (
          <div className="service-category">
            <h3>White-Labeling & Licensing Solutions</h3>
            <p className="service-description">
              Scale our proven parliamentary voting technology across your organization or offer it as your own solution.
            </p>

            <div className="service-cards">
              <div className="service-card">
                <div className="service-card-header">
                  <h4>Enterprise Licensing</h4>
                  <span className="service-price">500-2500 HIVE annually</span>
                </div>
                <p>License our core technology for internal government use with unlimited voting sessions and custom development.</p>
                <ul className="service-features">
                  <li>Full source code access</li>
                  <li>Unlimited voting sessions</li>
                  <li>Enterprise-grade support</li>
                  <li>Custom development rights</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('enterprise-licensing')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>White-Label Solution</h4>
                  <span className="service-price">250-1000 HIVE</span>
                </div>
                <p>Offer TransparenSee technology under your own brand for political parties, unions, and large organizations.</p>
                <ul className="service-features">
                  <li>Custom branding</li>
                  <li>Multi-client management</li>
                  <li>Revenue sharing options</li>
                  <li>Reseller support services</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('white-label')}>
                  Request Information
                </button>
              </div>

              <div className="service-card">
                <div className="service-card-header">
                  <h4>Custom UI & Branding</h4>
                  <span className="service-price">125-375 HIVE one-time</span>
                </div>
                <p>Complete visual customization of the platform to match your organization's brand identity and requirements.</p>
                <ul className="service-features">
                  <li>Custom UI development</li>
                  <li>Brand integration</li>
                  <li>Accessibility optimization</li>
                  <li>UX consultancy</li>
                </ul>
                <button className="service-button" onClick={() => handleContactClick('custom-branding')}>
                  Request Information
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {contactFormVisible && (
        <div ref={contactFormRef} className="contact-form-section">
          <h3>Request More Information</h3>
          {formSubmitted ? (
            <div className="success-message">
              <span className="success-icon">✅</span>
              Thank you for your interest! Our team will contact you shortly about the {formData.service.replace(/-/g, ' ')} service.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Your organization or government body"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Additional Information</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please provide any specific requirements or questions you have"
                  rows={4}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Submit Request
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setContactFormVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default EnterpriseServices; 