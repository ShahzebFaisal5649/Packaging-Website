import { useEffect } from 'react';

const BG = '#F5F2ED';
const G = '#1A4D2E';
const ACCENT = '#C8860A';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: G, marginBottom: 16 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 40, fontFamily: '"DM Mono", monospace' }}>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#333', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <section>
            <p>At Design Custom Box, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>1. What Personal Data is Collected</h2>
            <p>We may collect the following types of personal data when you register an account, place an order, or contact us:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0 0 0' }}>
              <li><strong>Contact Information:</strong> Name, email address, and phone number.</li>
              <li><strong>Shipping and Billing Information:</strong> Physical addresses used for delivery and invoicing.</li>
              <li><strong>Payment Information:</strong> Credit card details and billing addresses (processed securely via Stripe; we do not store full credit card numbers).</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP addresses and browser types.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>2. How Data is Used</h2>
            <p>We use your personal data to:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0 0 0' }}>
              <li>Process and fulfill your custom packaging orders.</li>
              <li>Communicate with you regarding order statuses, quotes, and customer support inquiries.</li>
              <li>Send marketing and promotional materials (only if you have opted in).</li>
              <li>Improve our website, services, and overall user experience.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>3. Data Storage and Security</h2>
            <p>We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. Your data is stored on secure servers, and payment transactions are encrypted using secure socket layer (SSL) technology.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>4. Cookies and Tracking</h2>
            <p>Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent, but some portions of our website may not function properly without them.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>5. Third-Party Services</h2>
            <p>We do not sell or rent your personal data to third parties. We may share data with trusted third-party service providers solely to facilitate our services, such as:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0 0 0' }}>
              <li><strong>Stripe:</strong> For secure payment processing.</li>
              <li><strong>Google:</strong> For authentication (Google Sign-In) and analytics.</li>
              <li><strong>Shipping Carriers:</strong> To deliver your orders.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>6. User Rights</h2>
            <p>You have the right to access, correct, update, or request the deletion of your personal data. To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>7. Data Retention Policy</h2>
            <p>We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, or as required by law (e.g., for tax and accounting purposes).</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>8. Children's Privacy</h2>
            <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect personal identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will immediately delete it from our servers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>9. Changes to Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>10. Contact Information</h2>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <div style={{ marginTop: 12, padding: '20px', background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Email:</strong> <a href="mailto:Designcustombox@gmail.com" style={{ color: ACCENT, textDecoration: 'none' }}>Designcustombox@gmail.com</a></p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Phone/WhatsApp:</strong> <a href="tel:+19132282682" style={{ color: ACCENT, textDecoration: 'none' }}>(913) 228-2682</a></p>
              <p style={{ margin: 0 }}><strong>Address:</strong> 5532 Big River Dr, The Colony Texas US 75056</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
