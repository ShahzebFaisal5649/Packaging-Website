import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './BoxDesignPage.module.css';

/* ─── Sample Request Modal ───────────────────────────────────────────────── */
function SampleRequestModal({ onClose, productName }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fullAddress = `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
    const request = {
      ...form,
      address: fullAddress,
      productName: productName || 'Custom Box Sample',
      userId: user?.id || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('novapack_sample_requests') || '[]');
    existing.push(request);
    localStorage.setItem('novapack_sample_requests', JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>Request a Physical Sample</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {submitted ? (
          <div className={styles.modalSuccess}>
            <div className={styles.successIcon}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(16,185,129,0.15)"/><path d="M12 20l6 6 10-12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Request submitted!</h3>
            <p>We'll ship your sample to <strong>{form.address}, {form.city}</strong> within 24 hours. Check your email at {form.email} for tracking info.</p>
            <button className={styles.modalBtn} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.modalForm} noValidate>
            <p className={styles.modalIntro}>We'll send a free physical sample to your address within 24 hours.</p>

            <div className={styles.modalRow}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Full Name *</label>
                <input name="name" className={`${styles.modalInput} ${errors.name ? styles.inputErr : ''}`} value={form.name} onChange={handleChange} placeholder="Jane Smith" />
                {errors.name && <span className={styles.fieldErr}>{errors.name}</span>}
              </div>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Email Address *</label>
                <input name="email" type="email" className={`${styles.modalInput} ${errors.email ? styles.inputErr : ''}`} value={form.email} onChange={handleChange} placeholder="you@example.com" />
                {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Phone Number *</label>
              <input name="phone" type="tel" className={`${styles.modalInput} ${errors.phone ? styles.inputErr : ''}`} value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              {errors.phone && <span className={styles.fieldErr}>{errors.phone}</span>}
            </div>

            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Street Address *</label>
              <input name="address" className={`${styles.modalInput} ${errors.address ? styles.inputErr : ''}`} value={form.address} onChange={handleChange} placeholder="123 Main Street, Apt 4B" />
              {errors.address && <span className={styles.fieldErr}>{errors.address}</span>}
            </div>

            <div className={styles.modalRow3}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>City *</label>
                <input name="city" className={`${styles.modalInput} ${errors.city ? styles.inputErr : ''}`} value={form.city} onChange={handleChange} placeholder="New York" />
                {errors.city && <span className={styles.fieldErr}>{errors.city}</span>}
              </div>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>State / Province</label>
                <input name="state" className={styles.modalInput} value={form.state} onChange={handleChange} placeholder="NY" />
              </div>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>ZIP / Postal *</label>
                <input name="zip" className={`${styles.modalInput} ${errors.zip ? styles.inputErr : ''}`} value={form.zip} onChange={handleChange} placeholder="10001" />
                {errors.zip && <span className={styles.fieldErr}>{errors.zip}</span>}
              </div>
            </div>

            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Country</label>
              <select name="country" className={styles.modalInput} value={form.country} onChange={handleChange}>
                {['United States','United Kingdom','Canada','Australia','Germany','France','Japan','Singapore','UAE','Pakistan','India','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className={styles.modalActions}>
              <button type="button" onClick={onClose} className={styles.modalCancelBtn}>Cancel</button>
              <button type="submit" className={styles.modalBtn}>Send My Sample</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    src: 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F12%2F03%2F23%2F00%2F5f58cf59-27ed-4de7-95f8-965d41fd2b5b%2FHero3.png?auto=format&ch=Width%2CDPR&crop=false&fm=png&q=25&w=900&h=900',
    alt: 'Packaging design by Khramova', designer: 'Khramova', color: '#D61D56',
  },
  {
    src: 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F19%2F05%2F04%2F52%2F345d2885-7d23-4381-aa98-e1fd7e2f526b%2FHero2.png?auto=format&ch=Width%2CDPR&crop=false&fm=png&q=25&w=900&h=900',
    alt: 'Packaging design by Imee008', designer: 'Imee008', color: '#739341',
  },
];

const CREATIVE_CARDS = [
  {
    title: 'Run a box design contest',
    desc: 'Designers from around the world enter your contest by sending you ideas. You give feedback to create the ideal box design.',
    link: '/contests',
    linkText: 'Start a contest',
    charImg: '/bear-ab1ac269f5.png',
    charType: 'right',
  },
  {
    title: 'Hire a professional packaging designer',
    desc: "Tell us what you're looking for and we'll match you with the perfect design partner. Or, if you'd prefer, browse portfolios and pick your own.",
    link: '/categories?tab=packaging-label',
    linkText: 'Find a designer',
    charImg: '/lentils-bc4d8c11f3.png',
    charType: 'bottom',
  },
  {
    title: "We're your creative partner",
    desc: "No matter how you choose to work, rest assured you're working with the best. All of our designers are hand-vetted and rated, and our team provides 24/7 support.",
    link: '/how-it-works',
    linkText: 'Learn more',
    charImg: '/bird-96e205676a.png',
    charType: 'top',
  },
];

const DESIGNERS = [
  {
    id: 1315030, name: 'Emir Alicic', level: 'Top Level', rating: '4.98', reviews: 218,
    stats: [{ a: '302', l: 'Projects' }, { a: '71', l: 'Repeat clients' }, { a: '84%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058', alt: 'Chocolate Wrapper' },
      { src: 'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac', alt: 'Food Packaging' },
      { src: 'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82', alt: 'Brand Packaging' },
      { src: 'https://images-platform.99static.com//1XYjPvxjL_twqFBcsKPn97LKMBc=/400x400/99designs-contests-attachments/132/132547/attachment_132547227', alt: 'Label Design' },
    ], initial: 'E',
  },
  {
    id: 1465010, name: 'Esteban Tolosa', level: 'Top Level', rating: '4.98', reviews: 384,
    stats: [{ a: '657', l: 'Projects' }, { a: '91', l: 'Repeat clients' }, { a: '92%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520', alt: 'Luxury Gin' },
      { src: 'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502', alt: 'Whiskey Box' },
      { src: 'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792', alt: 'Hot Sauce' },
      { src: 'https://images-platform.99static.com//gHmbJC-LzfTrszdsr3yJ6ufNmlQ=/400x400/99designs-work-samples/work-sample-designs/1465010/66bb153e-6755-4100-a159-374fd8df2cbb', alt: 'Mr Kylin' },
    ], initial: 'E',
  },
  {
    id: 3243158, name: 'Pepper Pack Design', level: 'Top Level', rating: '5.0', reviews: 216,
    stats: [{ a: '362', l: 'Projects' }, { a: '54', l: 'Repeat clients' }, { a: '72%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13', alt: 'Protein Bars' },
      { src: 'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg', alt: 'Coffee Packaging' },
      { src: 'https://images-platform.99static.com//KrnkmKQ5lmpmvQKD_bWzVchuEdY=/400x400/projects-files/200/20048/2004882/11810bcf-91d4-4879-8f95-1dcebce7f9bc.jpeg', alt: 'Popcorn Packaging' },
      { src: 'https://images-platform.99static.com//u2eV1Pn1_UMSdaAJnFRpFtLOFJk=/400x400/99designs-contests-attachments/108/108022/attachment_108022726', alt: 'Fruit Jellies' },
    ], initial: 'P',
  },
  {
    id: 'd4', name: 'Vasily ERA', level: 'Top Level', rating: '5.0', reviews: 222,
    stats: [{ a: '257', l: 'Projects' }, { a: '63', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'V',
  },
  {
    id: 'd5', name: 'vitalfuerze', level: 'Top Level', rating: '5.0', reviews: 165,
    stats: [{ a: '246', l: 'Projects' }, { a: '32', l: 'Repeat clients' }, { a: '82%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'V',
  },
  {
    id: 'd6', name: 'vesmil', level: 'Top Level', rating: '5.0', reviews: 184,
    stats: [{ a: '294', l: 'Projects' }, { a: '44', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'V',
  },
  {
    id: 'd7', name: 'eolinart', level: 'Top Level', rating: '5.0', reviews: 117,
    stats: [{ a: '208', l: 'Projects' }, { a: '40', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'E',
  },
  {
    id: 'd8', name: 'Senchy', level: 'Top Level', rating: '5.0', reviews: 216,
    stats: [{ a: '554', l: 'Projects' }, { a: '59', l: 'Repeat clients' }, { a: '98%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'S',
  },
  {
    id: 'd9', name: 'Jan_m', level: 'Top Level', rating: '4.94', reviews: 197,
    stats: [{ a: '543', l: 'Projects' }, { a: '34', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'J',
  },
  {
    id: 'd10', name: 'identity pulse', level: 'Top Level', rating: '4.99', reviews: 199,
    stats: [{ a: '246', l: 'Projects' }, { a: '32', l: 'Repeat clients' }, { a: '92%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'I',
  },
];

const PROCESS_STEPS = [
  {
    color: '#6B5DD3',
    screenTitle: '1. Describe your perfect box design',
    stepTitle: 'Describe your perfect box design',
    stepDesc: 'Our creative brief makes it easy to describe your vision for the perfect box design and set your budget.',
    icon: '✏',
  },
  {
    color: '#3D9B8E',
    screenTitle: '2. Find an amazing design partner',
    stepTitle: 'Find an amazing design partner',
    stepDesc: "We'll help you connect with professional designers to bring your vision to life. You'll collaborate and give feedback to create the ideal box for your product.",
    icon: '⊞',
  },
  {
    color: '#E83E8C',
    screenTitle: '3. Get a box design you love',
    stepTitle: 'Get a box design you love',
    stepDesc: "We're your creative partner from start to finish. Once you finalize your design, we'll transfer the copyright and send you the image files.",
    icon: '♥',
  },
];

const GALLERY_IMGS = [
  'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058',
  'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac',
  'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82',
  'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520',
  'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502',
  'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792',
];

const CONTEST_CARDS = [
  {
    id: 'c1',
    title: 'Custom beef jerky packaging & labeling',
    price: 'US$799',
    desc: 'Premium beef jerky brand needs standout packaging that communicates quality, heritage, and bold flavor.',
    imgs: [
      'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792',
      'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058',
      'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520',
    ],
    entries: 134, designers: 19,
  },
  {
    id: 'c2',
    title: 'Luxury cosmetics packaging for skincare line',
    price: 'US$1,299',
    desc: 'High-end skincare brand looking for elegant, minimalist packaging that conveys luxury and sustainability.',
    imgs: [
      'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac',
      'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82',
      'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13',
    ],
    entries: 89, designers: 27,
  },
  {
    id: 'c3',
    title: 'Artisan coffee subscription box design',
    price: 'US$599',
    desc: 'Monthly coffee subscription box needs to feel warm, artisanal, and inviting. Must stand out on Instagram.',
    imgs: [
      'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg',
      'https://images-platform.99static.com//KrnkmKQ5lmpmvQKD_bWzVchuEdY=/400x400/projects-files/200/20048/2004882/11810bcf-91d4-4879-8f95-1dcebce7f9bc.jpeg',
      'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502',
    ],
    entries: 112, designers: 31,
  },
  {
    id: 'c4',
    title: 'Craft gin bottle and box packaging',
    price: 'US$999',
    desc: 'Small-batch gin distillery needs premium, luxurious packaging that tells our botanical story.',
    imgs: [
      'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520',
      'https://images-platform.99static.com//gHmbJC-LzfTrszdsr3yJ6ufNmlQ=/400x400/99designs-work-samples/work-sample-designs/1465010/66bb153e-6755-4100-a159-374fd8df2cbb',
      'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058',
    ],
    entries: 76, designers: 22,
  },
  {
    id: 'c5',
    title: 'Organic snack bar packaging redesign',
    price: 'US$449',
    desc: 'Healthy snack brand refreshing its look. Need clean, modern design that communicates natural ingredients.',
    imgs: [
      'https://images-platform.99static.com//u2eV1Pn1_UMSdaAJnFRpFtLOFJk=/400x400/99designs-contests-attachments/108/108022/attachment_108022726',
      'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13',
      'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac',
    ],
    entries: 68, designers: 18,
  },
  {
    id: 'c6',
    title: 'Popcorn brand packaging for retail shelves',
    price: 'US$549',
    desc: 'Gourmet popcorn company needs eye-catching retail packaging that pops on the shelf and appeals to all ages.',
    imgs: [
      'https://images-platform.99static.com//KrnkmKQ5lmpmvQKD_bWzVchuEdY=/400x400/projects-files/200/20048/2004882/11810bcf-91d4-4879-8f95-1dcebce7f9bc.jpeg',
      'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg',
      'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82',
    ],
    entries: 93, designers: 25,
  },
];

const PRICING_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum'];
const PRICING_PRICES = ['US$449', 'US$749', 'US$1,199', 'US$1,699'];
const PRICING_ROWS = [
  { feature: 'Design concepts (approx.)', values: ['30', '40', '90', '40'] },
  { feature: '100% money-back guarantee', values: [true, true, true, true] },
  { feature: 'Full copyright ownership', values: [true, true, true, true] },
  { feature: 'Mid & Top Level designers only', values: [false, true, true, true] },
  { feature: 'Top Level designers only', values: [false, false, false, true] },
  { feature: 'Dedicated manager', values: [false, false, true, true] },
  { feature: 'Prioritized support', values: [false, false, true, true] },
];

const LEARNING = [
  {
    title: '9 tips for better packaging design',
    desc: 'Here are 9 insider tips to help you create outstanding packaging design.',
    img: 'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg',
    href: '#', author: 'Martis Lupus', cta: 'Discover packaging tips',
  },
  {
    title: 'How to design product packaging',
    desc: 'Discover packaging tips. Learn the ins-and-outs of product packaging design with this ultimate guide.',
    img: 'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13',
    href: '#', author: 'Imeeoo8', cta: 'Learn about packaging design',
  },
  {
    title: 'The top packaging trends',
    desc: 'Discover the stunning packaging trends that will be dominating the industry this year.',
    img: 'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058',
    href: '#', author: 'Terry Bogard', cta: 'Make me trendy',
  },
];

const FAQS = [
  { q: 'How does a box design contest work?', a: "Start by writing a brief that describes your brand and your box design vision. Once you launch the contest, dozens of designers from around the world submit unique concepts. You give feedback, and at the end of the contest you pick your favorite. You'll receive all the files and full copyright transfer." },
  { q: 'How do I start a box design project with a designer?', a: "Browse our marketplace to find a designer whose style you love, then invite them to a project. Or let us match you with the right designer for your brief. You'll work together directly, giving feedback and refining your design until it's perfect." },
  { q: 'How many box design concepts will I receive?', a: "The number of concepts depends on your price package. Bronze packages receive approximately 30 concepts, Silver 40, Gold up to 90, and Platinum around 40 guaranteed from top-tier designers. All packages include unlimited revisions from your chosen designer." },
  { q: 'Who are the designers creating my box design?', a: "Our global community includes over one million designers from more than 190 countries. Each designer is vetted and rated by our team and by clients. You'll see their reviews and portfolios so you can choose with confidence." },
  { q: 'Is my box design idea confidential?', a: "Yes. Our designers agree to keep your project details confidential. You can also add an NDA to your contest for extra protection, ensuring that none of the submitted concepts can be used by the designers after your contest ends." },
  { q: 'What files will I receive?', a: "You'll receive the final design in print-ready formats, typically Adobe Illustrator (.ai), EPS, and PDF files. You'll also get web preview formats in PNG and JPEG. All files come with full copyright transfer so you can use them however you need." },
  { q: 'Should I run a box design contest or hire a freelancer?', a: "A contest is ideal if you want to explore many creative directions and see dozens of concepts before committing. Hiring a designer is better if you have a specific style in mind, want a more collaborative process, or prefer working directly with one person from brief to final file." },
  { q: 'What type of box design do I need?', a: "The right box design depends on your product, industry, and retailer requirements. Common types include folding cartons, rigid boxes, mailer boxes, and pillow boxes. Our designers can work with any shape or style, and they'll ask about your specific requirements during the brief process." },
  { q: 'What if I have more than one SKU or product variant?', a: "Many of our designers are experienced in creating packaging systems across multiple SKUs and variants. You can include your full product range in the brief, and the designer will propose a cohesive design system that works across all variants while differentiating each product clearly." },
  { q: "I don't have a dieline template — is that okay?", a: "Absolutely. Many clients don't have one at the start. Designers can work from your box dimensions, and once you've chosen a winning design, they can produce print-ready artwork to fit a dieline template from your manufacturer or suggest standard sizes that work for your product." },
  { q: 'Who owns the copyright of my box design?', a: "You do. Once you select a winner and the prize is awarded, full copyright transfers to you. You're legally entitled to use the design however you like. Any designs that weren't selected remain the property of their respective designers." },
  { q: 'How do I protect my box design idea with an NDA?', a: "You can add a Non-Disclosure Agreement (NDA) to your contest during the setup process. All designers who enter must agree to the NDA before they can see your brief and submit designs. This protects your idea from being shared or reused outside of your contest." },
];

/* ─── Star Rating ────────────────────────────────────────────────────────── */
function StarRating({ rating }) {
  const val = parseFloat(rating);
  return (
    <span className={styles.stars} aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const pct = Math.min(100, Math.max(0, (val - (n - 1)) * 100));
        return (
          <span key={n} className={styles.starWrap}>
            <span className={styles.starBg}>★</span>
            <span className={styles.starFill} style={{ width: `${pct}%` }}>★</span>
          </span>
        );
      })}
    </span>
  );
}

/* ─── Creative Card (character hover animation) ──────────────────────────── */
function CreativeCard({ title, desc, link, linkText, charImg, charType }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={styles.creativeCard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={charImg}
        alt=""
        className={`${styles.creativeChar} ${styles[`creativeChar_${charType}`]} ${hovered ? styles.creativeCharVisible : ''}`}
        aria-hidden="true"
      />
      <h3 className={styles.creativeCardTitle}>{title}</h3>
      <p className={styles.creativeCardDesc}>{desc}</p>
      <a href={link} className={styles.creativeCardLink}>{linkText}</a>
    </div>
  );
}

/* ─── Designer Card (with portfolio carousel) ────────────────────────────── */
function DesignerCard({ d }) {
  const [idx, setIdx] = useState(0);
  const total = d.portfolio.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <div className={styles.designerCard}>
      <div className={styles.cardMeta}>
        <div className={styles.cardAvatarWrap}>
          <img
            className={styles.cardAvatar}
            src={`https://99designs.com/avatars/users/${d.id}/128`}
            alt={d.name}
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
          <span className={styles.cardAvatarFallback} style={{ display: 'none' }}>{d.initial}</span>
        </div>
        <div>
          <div className={styles.cardName}>{d.name}</div>
          <span className={styles.levelPill}>{d.level}</span>
          <div className={styles.cardRatingRow}>
            <span className={styles.ratingNum}>{d.rating}</span>
            <StarRating rating={d.rating} />
            <span className={styles.reviewCount}>({d.reviews})</span>
          </div>
        </div>
      </div>

      <div className={styles.cardStats}>
        {d.stats.map((s) => (
          <div key={s.l} className={styles.statCol}>
            <div className={styles.statAmount}>{s.a}</div>
            <div className={styles.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className={styles.carousel}>
        <div className={styles.carouselViewport}>
          <div className={styles.carouselTrack} style={{ transform: `translateX(-${idx * 100}%)` }}>
            {d.portfolio.map((p, i) => (
              <div key={i} className={styles.carouselSlide}>
                <img src={p.src} alt={p.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
              </div>
            ))}
          </div>
          <button className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`} onClick={prev} aria-label="Previous">
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none"><path d="M6 1L1 6.5 6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className={`${styles.carouselBtn} ${styles.carouselBtnNext}`} onClick={next} aria-label="Next">
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none"><path d="M1 1l5 5.5L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className={styles.carouselDots}>
          {d.portfolio.map((_, i) => (
            <button key={i} className={`${styles.carouselDot} ${i === idx ? styles.carouselDotActive : ''}`} onClick={() => setIdx(i)} aria-label={`Design ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className={styles.cardCta}>
        <a href="/categories?tab=packaging-label" className={styles.requestBtn}>Request quote</a>
      </div>
    </div>
  );
}

/* ─── Designer Slider (mouse-edge scrolling) ─────────────────────────────── */
function DesignerSlider() {
  const containerRef = useRef(null);
  const velRef = useRef(0);
  const rafRef = useRef(null);

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (pct < 0.12) velRef.current = -4;
    else if (pct > 0.88) velRef.current = 4;
    else velRef.current = 0;
  };

  useEffect(() => {
    const tick = () => {
      if (containerRef.current && velRef.current !== 0) {
        containerRef.current.scrollLeft += velRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.designerSlider}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { velRef.current = 0; }}
    >
      <div className={styles.designerTrack}>
        {DESIGNERS.map((d) => <DesignerCard key={d.id} d={d} />)}
      </div>
    </div>
  );
}

/* ─── Contest Slider (mouse-edge scrolling) ──────────────────────────────── */
function ContestSlider() {
  const containerRef = useRef(null);
  const velRef = useRef(0);
  const rafRef = useRef(null);

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (pct < 0.12) velRef.current = -4;
    else if (pct > 0.88) velRef.current = 4;
    else velRef.current = 0;
  };

  useEffect(() => {
    const tick = () => {
      if (containerRef.current && velRef.current !== 0) {
        containerRef.current.scrollLeft += velRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.contestSlider}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { velRef.current = 0; }}
    >
      <div className={styles.contestTrack}>
        {CONTEST_CARDS.map((c) => (
          <a key={c.id} href="/categories?tab=packaging-label" className={styles.contestCard}>
            <div className={styles.contestCardTop}>
              <div className={styles.contestCardTitle}>{c.title}</div>
              <div className={styles.contestCardPrice}>{c.price}</div>
              <div className={styles.contestCardDesc}>{c.desc}</div>
            </div>
            <div className={styles.contestCardImgs}>
              {c.imgs.map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" decoding="async" />
              ))}
            </div>
            <div className={styles.contestCardStats}>
              <span><strong>{c.entries}</strong> entries</span>
              <span><strong>{c.designers}</strong> designers</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Laptop Process ─────────────────────────────────────────────────────── */
function ProcessLaptop({ step, onPrev, onNext }) {
  const s = PROCESS_STEPS[step];

  return (
    <div className={styles.laptopOuter}>
      <button className={`${styles.laptopArrow} ${styles.laptopArrowLeft}`} onClick={onPrev} aria-label="Previous step">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className={styles.laptopWrapper}>
        <div className={styles.laptopLid}>
          <div className={styles.laptopCamera} />
          <div className={styles.laptopScreen}>
            <div className={styles.screenHeader} style={{ background: s.color }}>
              <span>{s.icon}</span> {s.screenTitle}
            </div>

            {step === 0 && (
              <div className={styles.screenBrief}>
                <p className={styles.briefText}>We'd like a simple and timeless design</p>
                <p className={styles.briefText}>that's purple in color and appeals to a</p>
                <p className={styles.briefCursor}>youthful audience<span className={styles.cursor}>|</span></p>
                <div className={styles.briefLine} />
                <div className={styles.briefLine} />
                <div className={styles.briefLine} />
              </div>
            )}

            {step === 1 && (
              <div className={styles.screenGallery}>
                {GALLERY_IMGS.map((src, i) => (
                  <div key={i} className={styles.galleryThumb}>
                    <img src={src} alt={`Design ${i + 1}`} />
                    <div className={styles.galleryLabel}>#{i + 1} by designer</div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className={styles.screenWinner}>
                <div className={styles.winnerLeft}>
                  <img src={GALLERY_IMGS[5]} alt="Winner design" className={styles.winnerImg} />
                </div>
                <div className={styles.winnerRight}>
                  <div className={styles.winnerMeta}>#8 by onripus <span>×</span></div>
                  <button className={styles.winnerBtn} style={{ background: s.color }}>♥ Award as winner!</button>
                  <div className={styles.chatBubbleDesigner}>Hi there! Here's my idea. I'm trying to keep it super simple so that it's timeless.</div>
                  <div className={styles.chatBubbleClient}>Nice! We love it!</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.laptopHinge} />
        <div className={styles.laptopBase}>
          <div className={styles.laptopTrackpad} />
        </div>
      </div>

      <button className={`${styles.laptopArrow} ${styles.laptopArrowRight}`} onClick={onNext} aria-label="Next step">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */
export default function BoxDesignPage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [procStep, setProcStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [sampleOpen, setSampleOpen] = useState(false);
  const heroTimer = useRef(null);
  const laptopTimer = useRef(null);

  useEffect(() => {
    heroTimer.current = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(heroTimer.current);
  }, []);

  useEffect(() => {
    laptopTimer.current = setInterval(
      () => setProcStep((s) => (s + 1) % PROCESS_STEPS.length),
      5000,
    );
    return () => clearInterval(laptopTimer.current);
  }, []);

  const goHero = (i) => {
    setHeroIdx(i);
    clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => setHeroIdx((j) => (j + 1) % HERO_SLIDES.length), 5000);
  };

  const goStep = (i) => {
    setProcStep(i);
    clearInterval(laptopTimer.current);
    laptopTimer.current = setInterval(
      () => setProcStep((s) => (s + 1) % PROCESS_STEPS.length),
      5000,
    );
  };

  const prevStep = () => goStep((procStep - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length);
  const nextStep = () => goStep((procStep + 1) % PROCESS_STEPS.length);

  const slide = HERO_SLIDES[heroIdx];

  const faqLeft = FAQS.slice(0, Math.ceil(FAQS.length / 2));
  const faqRight = FAQS.slice(Math.ceil(FAQS.length / 2));

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        {/* ══ 1. HERO — left artwork, right text ═══════════════════════════ */}
        <div className={styles.pageTop}>
          <div className={styles.artworkCol}>
            {HERO_SLIDES.map((sl, i) => (
              <div key={i} className={`${styles.artSlide} ${i === heroIdx ? styles.artSlideActive : ''}`}>
                <img src={sl.src} alt={sl.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                <figcaption className={styles.artAttrib}>by {sl.designer}</figcaption>
              </div>
            ))}
          </div>

          <div className={styles.rightCol}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle} style={{ color: slide.color }}>
                Custom box design for your brand
              </h1>
              <div className={styles.heroBody}>
                <p>An amazing product needs to come in an equally amazing box. Wow your customers with a box design that's as unique as the product you've got inside.</p>
                <ul className={styles.heroBullets}>
                  <li>Professional designers—all rated and reviewed</li>
                  <li>Custom box design for all budgets</li>
                  <li>Two design options: host a contest or work 1:1 with a freelance designer</li>
                </ul>
              </div>
              <div className={styles.heroCtas}>
                <a href="/custom-box" className={styles.btnPrimary} style={{ background: slide.color, borderColor: slide.color }}>
                  Start a project
                </a>
                <a href="/contests" className={styles.btnLink} style={{ color: slide.color, borderColor: slide.color }}>
                  Start a contest
                </a>
                <button onClick={() => setSampleOpen(true)} className={styles.btnSample}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17,7 17,2 7,2 7,7"/></svg>
                  Request Free Sample
                </button>
              </div>
              <div className={styles.heroDots}>
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} className={`${styles.heroDot} ${i === heroIdx ? styles.heroDotActive : ''}`} onClick={() => goHero(i)} aria-label={`Slide ${i + 1}`} style={i === heroIdx ? { background: slide.color } : {}} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ 2. DESIGNER SLIDER ═══════════════════════════════════════════ */}
        <section className={styles.designersSection} aria-labelledby="designers-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="designers-title">The right designer is just a click away</h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 20px' }} />
            <p className={styles.sectionSub}>
              We've curated the best product packaging designers so you can find the right expert and request a quote instantly.
            </p>
          </div>
          <DesignerSlider />
          <div className={styles.showMoreWrap}>
            <a href="/categories?tab=packaging-label" className={styles.showMoreLink}>
              Show me more designers →
            </a>
          </div>
        </section>

        {/* ══ 3. CREATIVE IDEAS — 3 cards with character animations ════════ */}
        <section className={styles.creativeSection} aria-labelledby="creative-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="creative-title">
              Custom box design: creative ideas from professional designers
            </h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 18px' }} />
            <p className={styles.sectionSub} style={{ marginBottom: '36px' }}>
              There's no better platform to get a box design. With two ways to work, you get the design you want, in the manner that works best for you. No templates. No robots. No frustrating apps. Just a 100% unique box for your product.
            </p>
            <div className={styles.creativeCards}>
              {CREATIVE_CARDS.map((c) => (
                <CreativeCard key={c.title} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4. PROCESS — silver MacBook laptop, 3 slides, 5s auto-timer ═ */}
        <section className={styles.processSection} aria-labelledby="process-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="process-title">The box design process</h2>
            <div className={styles.infoDivider} style={{ margin: '12px auto 40px' }} />

            <ProcessLaptop step={procStep} onPrev={prevStep} onNext={nextStep} />

            <div className={styles.processSteps}>
              {PROCESS_STEPS.map((s, i) => (
                <button
                  key={i}
                  className={`${styles.processStep} ${i === procStep ? styles.processStepActive : ''}`}
                  onClick={() => goStep(i)}
                >
                  <div className={styles.processIcon} style={i === procStep ? { color: s.color } : {}}>
                    {s.icon}
                  </div>
                  <h3 className={styles.processStepTitle} style={i === procStep ? { color: s.color } : {}}>
                    {i + 1}. {s.stepTitle}
                  </h3>
                  <p className={styles.processStepDesc}>{s.stepDesc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. CATEGORY SLIDER — contest-card style ══════════════════════ */}
        <section className={styles.categorySection} aria-labelledby="category-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="category-title">Any style, any industry. Our box designers do it all.</h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 8px' }} />
            <p className={styles.sectionSub} style={{ marginBottom: '0' }}>
              Browse real box design contests and see what's possible when creativity meets expertise.
            </p>
          </div>
          <ContestSlider />
          <div className={styles.showMoreWrap}>
            <a href="/contests" className={styles.showMoreLink}>
              See more box design contests →
            </a>
          </div>
        </section>

        {/* ══ 6. TESTIMONIAL — white bg, product left, quote right ═════════ */}
        <section className={styles.testimonialSection} aria-label="Client testimonial">
          <div className="container">
            <div className={styles.testimonialInner}>
              <div className={styles.testimonialProductCol}>
                <img
                  src="https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792"
                  alt="Beef jerky packaging design"
                  className={styles.testimonialProductImg}
                  loading="lazy"
                  decoding="async"
                />
                <p className={styles.testimonialByLine}>by ugmark</p>
              </div>

              <div className={styles.testimonialContent}>
                <div className={styles.testimonialStarRow}>
                  <StarRating rating="4.9" />
                  <span className={styles.testimonialStarText}>
                    Rated 4.9 / 5 — <a href="#" className={styles.testimonialStarLink}>15,892 reviews</a>
                  </span>
                </div>
                <div className={styles.quoteMark}>"</div>
                <h3 className={styles.testimonialHeadline}>It set me apart from the others.</h3>
                <p className={styles.testimonialBody}>
                  Getting all my design work completed on 99designs allowed me to move onto my first sales! Good packaging design is crucial to the overall success of my business.
                </p>
                <div className={styles.testimonialDivider} />
                <div className={styles.testimonialPersonRow}>
                  <div className={styles.testimonialAvatar}>D</div>
                  <div>
                    <div className={styles.testimonialName}>Dan Ford</div>
                    <div className={styles.testimonialCompany}>Bald Rock Beef Jerky</div>
                  </div>
                </div>
                <div className={styles.testimonialStats}>
                  <span><strong>219</strong> designs</span>
                  <div className={styles.statDivider} />
                  <span><strong>19</strong> designers</span>
                </div>
                <a href="/contests" className={styles.testimonialBtn}>
                  Start a contest
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 6b. SAMPLE REQUEST CTA ════════════════════════════════════════ */}
        <section className={styles.sampleSection} aria-labelledby="sample-title">
          <div className="container">
            <div className={styles.sampleInner}>
              <div className={styles.sampleContent}>
                <span className={styles.sampleBadge}>Free</span>
                <h2 className={styles.sampleTitle} id="sample-title">Not sure yet? Get a physical sample first.</h2>
                <p className={styles.sampleDesc} style={{ textAlign: 'justify' }}>
                  We'll ship a free physical sample of our packaging materials directly to your door so you can feel the quality before you commit. Samples ship within 24 hours to any address worldwide.
                </p>
                <ul className={styles.sampleFeatures}>
                  {['Free shipping worldwide', 'Ships within 24 hours', 'Multiple material options', 'No credit card required'].map(f => (
                    <li key={f} className={styles.sampleFeature}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(20,184,166,0.2)"/><path d="M5 8l2 2 4-4" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setSampleOpen(true)} className={styles.sampleBtn}>
                  Request Physical Sample
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className={styles.sampleVisual}>
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80&auto=format"
                  alt="Sample packaging boxes"
                  className={styles.sampleImg}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. PRICING — HTML comparison table ═══════════════════════════ */}
        <section className={styles.pricingSection} aria-labelledby="pricing-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="pricing-title">Professional box design, no matter your budget</h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 16px' }} />
            <p className={styles.pricingIntro}>
              We guarantee that you'll get a great box design no matter what your budget is. If you hire a designer, you can negotiate a budget that works for both you and your designer. If you launch a contest, we offer four fixed-price options. Prices exclude Sales Tax.
            </p>

            <div className={styles.pricingTableWrap}>
              <table className={styles.pricingTable}>
                <thead>
                  <tr>
                    <th className={`${styles.ptTierHead} ${styles.ptFeatureCol}`} />
                    {PRICING_TIERS.map((tier, ti) => (
                      <th
                        key={tier}
                        className={`${styles.ptTierHead} ${ti === 2 ? styles.ptGoldCol : ''}`}
                      >
                        {tier}
                        {ti === 2 && <div style={{ fontSize: '11px', fontWeight: 600, color: '#d4a017', marginTop: '3px' }}>Most popular</div>}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <td className={`${styles.ptPriceCell} ${styles.ptFeatureCol}`} />
                    {PRICING_PRICES.map((price, ti) => (
                      <td key={price} className={`${styles.ptPriceCell} ${ti === 2 ? styles.ptGoldCol : ''}`}>
                        {price}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRICING_ROWS.map((row) => (
                    <tr key={row.feature} className={styles.ptRow}>
                      <td className={styles.ptFeature}>{row.feature}</td>
                      {row.values.map((val, ti) => (
                        <td key={ti} className={`${styles.ptCell} ${ti === 2 ? styles.ptGoldCol : ''}`}>
                          {typeof val === 'boolean'
                            ? val
                              ? <span className={styles.ptCheck}>✓</span>
                              : <span className={styles.ptDash}>—</span>
                            : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className={styles.ptBtnCell} />
                    {PRICING_TIERS.map((tier, ti) => (
                      <td key={tier} className={`${styles.ptBtnCell} ${ti === 2 ? styles.ptGoldCol : ''}`}>
                        <a
                          href="/categories?tab=packaging-label"
                          className={`${styles.tierBtn} ${ti === 2 ? styles.tierBtnGold : ''}`}
                        >
                          Start {tier}
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══ 8. LEARNING — 3 articles ══════════════════════════════════════ */}
        <section className={styles.learningSection} aria-labelledby="learning-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="learning-title">Everything you need to know to create great packaging</h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 32px' }} />
            <div className={styles.learningGrid}>
              {LEARNING.map((art) => (
                <a key={art.title} href={art.href} className={styles.learningCard}>
                  <div className={styles.learningImgWrap}>
                    <img src={art.img} alt={art.title} className={styles.learningImg} loading="lazy" decoding="async" />
                    <div className={styles.learningAuthorBar}>by {art.author}</div>
                  </div>
                  <div className={styles.learningBody}>
                    <h3 className={styles.learningTitle}>{art.title}</h3>
                    <p className={styles.learningDesc}>{art.desc}</p>
                    <span className={styles.learningCta}>{art.cta} →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 9. FAQ — 2-column, +/− icons ═════════════════════════════════ */}
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="faq-title">Your burning box design FAQs, answered.</h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 32px' }} />
            <div className={styles.faqGrid}>
              {[faqLeft, faqRight].map((col, ci) => (
                <div key={ci} className={styles.faqCol}>
                  {col.map((faq, li) => {
                    const globalIdx = ci === 0 ? li : faqLeft.length + li;
                    const isOpen = openFaq === globalIdx;
                    return (
                      <div key={globalIdx} className={styles.faqItem}>
                        <button
                          className={styles.faqQuestion}
                          onClick={() => setOpenFaq(isOpen ? null : globalIdx)}
                          aria-expanded={isOpen}
                        >
                          {faq.q}
                          <span className={styles.faqToggle}>{isOpen ? '−' : '+'}</span>
                        </button>
                        <div className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}>
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 10. HELP — floating person image ═════════════════════════════ */}
        <section className={styles.helpSection} aria-labelledby="help-title">
          <div className="container">
            <div className={styles.helpInner}>
              <div className={styles.helpImgCol}>
                <img
                  src="/sitting%20man.png"
                  alt="Design consultant"
                  className={styles.helpPersonImg}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <h2 className={styles.helpTitle} id="help-title">
                  We're here to help
                </h2>
                <p className={styles.helpBody}>
                  Our smart and friendly client support team is available 24/7 to guide you through the creative process and answer all of your questions. Send us an email or call to speak with an actual human.
                </p>
                <div className={styles.helpActions}>
                  <a href="tel:+18005131678" className={styles.helpPhone}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" fill="currentColor" /></svg>
                    1 800 513 1678
                  </a>
                </div>
                <a href="#" className={styles.helpConsult}>Book a free design consultation →</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {sampleOpen && <SampleRequestModal onClose={() => setSampleOpen(false)} productName="Premium Box Sample" />}
    </div>
  );
}
