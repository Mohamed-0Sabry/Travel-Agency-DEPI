// Demo Page Component

import { useState } from 'react';
import { Button } from '../Components/ui/Button';
import { Text } from '@/Components/ui/Text';
export default function ButtonDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Action completed!');
    }, 2000);
  };

  const handleSubmit = () => {
    alert(`Form submitted with: ${formData.name}, ${formData.email}`);
  };

  return (
    <>
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Button Component Demo</h1>
        <p className="lead text-muted">
          Explore different button variants, sizes, and states
        </p>
      </div>

      {/* Variants Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Button Variants</h3>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="clear">Clear Button</Button>
          </div>
        </div>
      </div>

      {/* Sizes Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Button Sizes</h3>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>
      </div>

      {/* With Icons Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Buttons with Icons</h3>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary" leftIcon="📁">Open File</Button>
            <Button variant="primary" rightIcon="➜">Next Step</Button>
            <Button variant="secondary" leftIcon="⚙️">Settings</Button>
            <Button variant="clear" leftIcon="🔍">Search</Button>
          </div>
        </div>
      </div>

      {/* States Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Button States</h3>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button 
              variant="primary" 
              isLoading={isLoading}
              onClick={handleLoadingClick}
            >
              {isLoading ? 'Loading...' : 'Click to Load'}
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Form Example */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Form Example</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="d-flex gap-2">
            <Button type="button" variant="primary" rightIcon="✓" onClick={handleSubmit}>
              Submit Form
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setFormData({ name: '', email: '' })}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons Example */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Action Buttons Example</h3>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5>Complete Your Profile</h5>
              <p className="text-muted mb-0">Add more information to get started</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="clear">Skip</Button>
              <Button variant="primary" rightIcon="→">Continue</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Button Group Example */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Button Group Example</h3>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <Button variant="primary" size="sm" onClick={() => alert('Saved!')}>Save</Button>
            <Button variant="secondary" size="sm" onClick={() => alert('Saved and closed!')}>Save & Close</Button>
            <Button variant="clear" size="sm" onClick={() => alert('Cancelled')}>Cancel</Button>
          </div>
          <p className="text-muted small mb-0">
            Common button combinations for actions
          </p>
        </div>
      </div>

      {/* All Combinations */}
      <div className="card">
        <div className="card-header">
          <h3 className="h5 mb-0">All Size & Variant Combinations</h3>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <h6>Primary</h6>
              <div className="d-flex flex-column gap-2">
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
            </div>
            <div className="col-md-4">
              <h6>Secondary</h6>
              <div className="d-flex flex-column gap-2">
                <Button variant="secondary" size="sm">Small Secondary</Button>
                <Button variant="secondary" size="md">Medium Secondary</Button>
                <Button variant="secondary" size="lg">Large Secondary</Button>
              </div>
            </div>
            <div className="col-md-4">
              <h6>Clear</h6>
              <div className="d-flex flex-column gap-2">
                <Button variant="clear" size="sm">Small Clear</Button>
                <Button variant="clear" size="md">Medium Clear</Button>
                <Button variant="clear" size="lg">Large Clear</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    
    <style>{`
        .bg-success {
          background-color: #276968 !important;
        }
        .text-success {
          color: #276968 !important;
        }
        .fw-semibold {
          font-weight: 600;
        }
        .letter-spacing-wide {
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold mb-3">Text Component Demo</h1>
          <p className="lead text-muted">
            Explore different text types, sizes, and styles using Bootstrap
          </p>
        </div>

        {/* Text Types Section */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Text Types</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <Text type="Header" size="3xl">This is a Header</Text>
            </div>
            <div className="mb-4">
              <Text type="SubHeader" size="2xl">This is a SubHeader</Text>
            </div>
            <div className="mb-4">
              <Text type="Paragraph" size="md">
                This is a paragraph with regular text. It has comfortable line height for better readability.
              </Text>
            </div>
            <div className="mb-4">
              <Text type="Paragraph" size="md">
                This is a sentence with a <Text type="Highlight" flow="Inline">highlighted word</Text> in the middle.
              </Text>
            </div>
            <div className="mb-4">
              <Text type="Label" size="sm">Label Text</Text>
            </div>
          </div>
        </div>

        {/* Size Variations */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Size Variations</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <Text type="Paragraph" size="sm">Small text (sm)</Text>
            </div>
            <div className="mb-3">
              <Text type="Paragraph" size="md">Medium text (md)</Text>
            </div>
            <div className="mb-3">
              <Text type="Paragraph" size="lg">Large text (lg)</Text>
            </div>
            <div className="mb-3">
              <Text type="Paragraph" size="xl">Extra large text (xl)</Text>
            </div>
            <div className="mb-3">
              <Text type="Paragraph" size="2xl">2xl text</Text>
            </div>
            <div className="mb-3">
              <Text type="Paragraph" size="3xl">3xl text</Text>
            </div>
          </div>
        </div>

        {/* Header Sizes */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Header Size Scale</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <Text type="Header" size="6xl">Massive Header (6xl)</Text>
            </div>
            <div className="mb-3">
              <Text type="Header" size="5xl">Huge Header (5xl)</Text>
            </div>
            <div className="mb-3">
              <Text type="Header" size="4xl">Very Large Header (4xl)</Text>
            </div>
            <div className="mb-3">
              <Text type="Header" size="3xl">Large Header (3xl)</Text>
            </div>
            <div className="mb-3">
              <Text type="Header" size="2xl">Medium Header (2xl)</Text>
            </div>
            <div className="mb-3">
              <Text type="Header" size="xl">Small Header (xl)</Text>
            </div>
          </div>
        </div>

        {/* Flow Types */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Flow Types (Block vs Inline)</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <h6 className="mb-2">Block Flow (default):</h6>
              <Text type="Paragraph" flow="Block">This text is in block flow.</Text>
              <Text type="Paragraph" flow="Block">Each element takes full width.</Text>
            </div>
            <div className="mb-4">
              <h6 className="mb-2">Inline Flow:</h6>
              <Text type="Paragraph" flow="Inline">This text is inline.</Text>
              <Text type="Paragraph" flow="Inline">They sit next to each other.</Text>
              <Text type="Paragraph" flow="Inline">Like words in a sentence.</Text>
            </div>
            <div className="mb-4">
              <h6 className="mb-2">Inline-Block Flow:</h6>
              <Text type="Highlight" flow="InlineBlock">Tag 1</Text>{' '}
              <Text type="Highlight" flow="InlineBlock">Tag 2</Text>{' '}
              <Text type="Highlight" flow="InlineBlock">Tag 3</Text>
            </div>
          </div>
        </div>

        {/* Inverted Text */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Inverted Text</h3>
          </div>
          <div className="card-body">
            <div className="bg-dark p-4 rounded mb-3">
              <Text type="Inverted" size="xl">White text on dark background</Text>
              <Text type="Inverted" size="md">Perfect for dark mode or hero sections</Text>
            </div>
            <div className="mb-3">
              <Text type="Inverted" invertedWithBg size="md">
                Inverted with background badge
              </Text>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Labels</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <Text type="Label">Featured</Text>
            </div>
            <div className="mb-3">
              <Text type="Label" size="sm">New Arrival</Text>
            </div>
            <div className="mb-3">
              <Text type="Label" size="md">Best Seller</Text>
            </div>
          </div>
        </div>

        {/* Real-world Examples */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Real-world Examples</h3>
          </div>
          <div className="card-body">
            {/* Article Example */}
            <div className="mb-5">
              <Text type="Label" className="mb-2">Technology</Text>
              <Text type="Header" size="3xl" className="mb-3">
                The Future of Web Development
              </Text>
              <Text type="SubHeader" size="xl" className="mb-3 text-muted">
                How modern frameworks are changing the landscape
              </Text>
              <Text type="Paragraph" size="md" className="mb-3">
                Web development has evolved significantly over the past decade. Modern frameworks like React, Vue, and Angular have revolutionized how we build user interfaces. 
                The introduction of <Text type="Highlight" flow="Inline">component-based architecture</Text> has made applications more maintainable and scalable.
              </Text>
              <Text type="Paragraph" size="md">
                As we look to the future, technologies like WebAssembly and edge computing promise to push the boundaries even further, enabling experiences that were previously impossible in the browser.
              </Text>
            </div>

            {/* Product Card Example */}
            <div className="border rounded p-4 mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Text type="Label" size="sm" className="mb-2">Premium</Text>
                  <Text type="Header" size="xl" className="mb-2">Professional Plan</Text>
                  <Text type="SubHeader" size="lg" className="mb-0">$49<Text type="Paragraph" flow="Inline" size="sm" className="text-muted">/month</Text></Text>
                </div>
                <Text type="Highlight" flow="InlineBlock" size="sm">Popular</Text>
              </div>
              <Text type="Paragraph" size="md" className="mb-0">
                Perfect for growing teams and businesses. Includes all features with priority support.
              </Text>
            </div>

            {/* Status Messages */}
            <div className="mb-3">
              <div className="alert alert-success d-flex align-items-center">
                <span className="me-2">✓</span>
                <Text type="Paragraph" size="md" className="mb-0">
                  Your changes have been saved successfully!
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Hierarchy */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h3 className="h5 mb-0">Typography Hierarchy Example</h3>
          </div>
          <div className="card-body">
            <Text type="Header" size="4xl" className="mb-4">Main Page Title</Text>
            <Text type="SubHeader" size="2xl" className="mb-3">Section Heading</Text>
            <Text type="Paragraph" size="lg" className="mb-3">
              This is a lead paragraph that introduces the section content. It's slightly larger than regular body text to draw attention.
            </Text>
            <Text type="SubHeader" size="xl" className="mb-2">Subsection Title</Text>
            <Text type="Paragraph" size="md" className="mb-3">
              Regular body text provides the main content. It should be comfortable to read with proper line height and sizing.
            </Text>
            <Text type="Paragraph" size="sm" className="text-muted">
              Small text can be used for captions, metadata, or less important information.
            </Text>
          </div>
        </div>
      </div>
    </>
    
  );
}