import { useEffect } from 'react';

const BG = '#F5F2ED';
const G = '#1A4D2E';
const ACCENT = '#C8860A';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: G, marginBottom: 16 }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 40, fontFamily: '"DM Mono", monospace' }}>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#333', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>1. Acceptance of Terms</h2>
            <p>By accessing and using the Design Custom Box website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>2. Description of Services</h2>
            <p>Design Custom Box provides premium custom packaging solutions, including but not limited to custom box design, printing, and packaging orders. We reserve the right to modify or discontinue, temporarily or permanently, the services with or without notice.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>3. Account Registration and Responsibilities</h2>
            <p>To use certain features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>4. Order Placement, Pricing, and Payment Terms</h2>
            <p>All orders are subject to acceptance and availability. Prices are subject to change without notice. We accept major credit cards and other secure payment methods via Stripe. Full payment is required before production begins.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>5. Custom Design Ownership and Intellectual Property</h2>
            <p>You retain full ownership of any designs, logos, or artwork you submit. By submitting designs, you grant us a non-exclusive license to reproduce the artwork solely for the purpose of fulfilling your order. Design Custom Box retains ownership of structural designs and website content.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>6. Production and Shipping Timelines</h2>
            <p>Standard production and shipping take approximately 5-8 business days after proof approval. While we strive to meet all deadlines, these timelines are estimates and not guaranteed.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>7. Refund, Return, and Cancellation Policy</h2>
            <p>Because our products are custom manufactured, we do not accept returns. If an error is made on our part (e.g., structural defect, print mismatch from approved proof), we will offer a free reprint or a refund. Orders may only be cancelled before production has begun.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>8. Limitation of Liability</h2>
            <p>Design Custom Box shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services or products.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Your continued use of the site following any changes signifies your acceptance of the new terms.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 12 }}>10. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
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
