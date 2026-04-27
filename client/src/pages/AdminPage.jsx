import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../hooks/useRoute';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './AdminPage.module.css';

/* ── Storage helpers ── */
const get = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));

/* ── Default data ── */
const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Custom Mailer Box', slug: 'custom-mailer-box', category: 'Mailer Boxes', description: 'Premium custom printed mailer boxes for e-commerce brands.', price: 2.50, dimensions: '30x20x10', boxType: 'Mailer', material: 'Corrugated', finish: 'Gloss UV', moq: 50, addons: 'Ribbon, Tissue Paper', image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=400&q=80&auto=format', createdAt: new Date().toISOString() },
  { id: 'p2', name: 'Rigid Gift Box', slug: 'rigid-gift-box', category: 'Product Packaging', description: 'Luxurious rigid boxes perfect for premium products.', price: 5.80, dimensions: '25x15x10', boxType: 'Rigid', material: 'Rigid Board', finish: 'Matte Lamination', moq: 100, addons: 'Magnetic Closure, Foam Insert', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80&auto=format', createdAt: new Date().toISOString() },
  { id: 'p3', name: 'Eco Kraft Box', slug: 'eco-kraft-box', category: 'Eco Packaging', description: 'Sustainable kraft packaging made from recycled materials.', price: 1.80, dimensions: '20x15x8', boxType: 'Tuck-End', material: 'Kraft', finish: 'Natural/Uncoated', moq: 50, addons: 'Soy-based ink printing', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format', createdAt: new Date().toISOString() },
];

const DEFAULT_INDUSTRIES = [
  { id: 'i1', name: 'Cosmetics & Beauty', slug: 'cosmetics-beauty', description: 'Premium packaging for skincare, makeup, and wellness products.', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', createdAt: new Date().toISOString() },
  { id: 'i2', name: 'Food & Beverage', slug: 'food-beverage', description: 'Certified food-safe packaging for gourmet and retail brands.', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', createdAt: new Date().toISOString() },
  { id: 'i3', name: 'E-Commerce', slug: 'e-commerce', description: 'Durable mailer boxes and shipping solutions for online retailers.', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', createdAt: new Date().toISOString() },
];

function seedDefaults() {
  if (!localStorage.getItem('novapack_products')) set('novapack_products', DEFAULT_PRODUCTS);
  if (!localStorage.getItem('novapack_industries')) set('novapack_industries', DEFAULT_INDUSTRIES);
}

/* ── Shared form field ── */
function Field({ label, required, children, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}{required && <span className={styles.req}> *</span>}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

/* ══ PRODUCT FORM ════════════════════════════════════════════════════════ */
const PRODUCT_CATEGORIES = ['Mailer Boxes', 'Product Packaging', 'Retail Boxes', 'Eco Packaging', 'Shipping Boxes', 'Custom Builder'];
const BOX_TYPES = ['Mailer', 'Rigid', 'Tuck-End', 'Auto-Bottom', 'Pillow', 'Display', 'Sleeve', 'Gable'];
const MATERIALS = ['Corrugated', 'Kraft', 'Rigid Board', 'SBS Cardboard', 'Recycled', 'Mylar'];
const FINISHES = ['Gloss UV', 'Matte Lamination', 'Soft-Touch', 'Aqueous Coating', 'Natural/Uncoated', 'Spot UV', 'Foil Stamping'];

const BLANK_PRODUCT = { name: '', slug: '', category: '', description: '', price: '', dimensions: '', boxType: '', material: '', finish: '', moq: 50, addons: '', image: '' };

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK_PRODUCT);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(initial?.image || '');
  const fileRef = useRef();

  const set_ = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (k === 'name' && !initial) {
      const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setForm(p => ({ ...p, name: v, slug }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setForm(p => ({ ...p, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    if (!form.material) e.material = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, price: Number(form.price), moq: Number(form.moq) || 50 });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      <div className={styles.formRow}>
        <Field label="Product Name" required error={errors.name}>
          <input className={styles.input} value={form.name} onChange={e => set_('name', e.target.value)} placeholder="e.g. Custom Mailer Box" />
        </Field>
        <Field label="Slug" >
          <input className={styles.input} value={form.slug} onChange={e => set_('slug', e.target.value)} placeholder="auto-generated" />
        </Field>
      </div>
      <div className={styles.formRow}>
        <Field label="Category" required error={errors.category}>
          <select className={styles.input} value={form.category} onChange={e => set_('category', e.target.value)}>
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Box Type">
          <select className={styles.input} value={form.boxType} onChange={e => set_('boxType', e.target.value)}>
            <option value="">Select type</option>
            {BOX_TYPES.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Description">
        <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => set_('description', e.target.value)} placeholder="Describe the product…" rows={3} />
      </Field>
      <div className={styles.formRow}>
        <Field label="Price per Unit ($)" required error={errors.price}>
          <input className={styles.input} type="number" step="0.01" min="0" value={form.price} onChange={e => set_('price', e.target.value)} placeholder="2.50" />
        </Field>
        <Field label="Min Order Qty (MOQ)">
          <input className={styles.input} type="number" min="1" value={form.moq} onChange={e => set_('moq', e.target.value)} />
        </Field>
      </div>
      <div className={styles.formRow}>
        <Field label="Dimensions (L×W×H cm)">
          <input className={styles.input} value={form.dimensions} onChange={e => set_('dimensions', e.target.value)} placeholder="30x20x10" />
        </Field>
        <Field label="Material" required error={errors.material}>
          <select className={styles.input} value={form.material} onChange={e => set_('material', e.target.value)}>
            <option value="">Select material</option>
            {MATERIALS.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
      </div>
      <div className={styles.formRow}>
        <Field label="Finish / Coating">
          <select className={styles.input} value={form.finish} onChange={e => set_('finish', e.target.value)}>
            <option value="">Select finish</option>
            {FINISHES.map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Available Add-ons">
          <input className={styles.input} value={form.addons} onChange={e => set_('addons', e.target.value)} placeholder="e.g. Ribbon, Tissue Paper" />
        </Field>
      </div>

      {/* Image upload */}
      <Field label="Product Image">
        <div className={styles.imageUpload} onClick={() => fileRef.current?.click()}>
          {imagePreview
            ? <img src={imagePreview} alt="preview" className={styles.imagePreview} />
            : <div className={styles.imagePlaceholder}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                <span>Click to upload image</span>
                <span className={styles.imageSub}>JPG, PNG, WebP — local file</span>
              </div>
          }
          <input ref={fileRef} type="file" accept="image/*" className={styles.fileHidden} onChange={handleImage} />
        </div>
        {imagePreview && <button type="button" className={styles.removeImg} onClick={() => { setImagePreview(''); set_('image', ''); }}>Remove image</button>}
      </Field>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        <button type="submit" className={styles.saveBtn}>
          {initial ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

/* ══ INDUSTRY FORM ═══════════════════════════════════════════════════════ */
const BLANK_INDUSTRY = { name: '', slug: '', description: '', image: '' };

function IndustryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK_INDUSTRY);
  const [imagePreview, setImagePreview] = useState(initial?.image || '');
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set_ = (k, v) => {
    if (k === 'name') {
      const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setForm(p => ({ ...p, name: v, slug: initial ? p.slug : slug }));
    } else {
      setForm(p => ({ ...p, [k]: v }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImagePreview(ev.target.result); setForm(p => ({ ...p, image: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      <div className={styles.formRow}>
        <Field label="Industry Name" required error={errors.name}>
          <input className={styles.input} value={form.name} onChange={e => set_('name', e.target.value)} placeholder="e.g. Cosmetics & Beauty" />
        </Field>
        <Field label="Slug">
          <input className={styles.input} value={form.slug} onChange={e => set_('slug', e.target.value)} />
        </Field>
      </div>
      <Field label="Description">
        <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => set_('description', e.target.value)} placeholder="Describe this industry segment…" rows={3} />
      </Field>
      <Field label="Industry Image">
        <div className={styles.imageUpload} onClick={() => fileRef.current?.click()}>
          {imagePreview
            ? <img src={imagePreview} alt="preview" className={styles.imagePreview} />
            : <div className={styles.imagePlaceholder}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                <span>Click to upload image</span>
              </div>
          }
          <input ref={fileRef} type="file" accept="image/*" className={styles.fileHidden} onChange={handleImage} />
        </div>
        {imagePreview && <button type="button" className={styles.removeImg} onClick={() => { setImagePreview(''); set_('image', ''); }}>Remove</button>}
      </Field>
      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        <button type="submit" className={styles.saveBtn}>{initial ? 'Save Changes' : 'Add Industry'}</button>
      </div>
    </form>
  );
}

/* ══ MAIN ADMIN PAGE ═════════════════════════════════════════════════════ */
export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [samples, setSamples] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(null);   // null | 'new' | product
  const [industryForm, setIndustryForm] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); return; }
    seedDefaults();
    reload();
  }, [user, isAdmin]);

  const reload = () => {
    setProducts(get('novapack_products'));
    setIndustries(get('novapack_industries'));
    setSamples(get('novapack_sample_requests'));
    const us = get('novapack_users');
    setUsers(us.filter(u => u.role !== 'admin'));
  };

  /* ── Product CRUD ── */
  const saveProduct = (form) => {
    const list = get('novapack_products');
    if (productForm === 'new') {
      const newP = { ...form, id: `p${Date.now()}`, createdAt: new Date().toISOString() };
      set('novapack_products', [...list, newP]);
    } else {
      set('novapack_products', list.map(p => p.id === productForm.id ? { ...productForm, ...form } : p));
    }
    setProductForm(null);
    reload();
  };

  const deleteProduct = (id) => {
    if (!confirm('Delete this product?')) return;
    set('novapack_products', get('novapack_products').filter(p => p.id !== id));
    reload();
  };

  /* ── Industry CRUD ── */
  const saveIndustry = (form) => {
    const list = get('novapack_industries');
    if (industryForm === 'new') {
      set('novapack_industries', [...list, { ...form, id: `i${Date.now()}`, createdAt: new Date().toISOString() }]);
    } else {
      set('novapack_industries', list.map(i => i.id === industryForm.id ? { ...industryForm, ...form } : i));
    }
    setIndustryForm(null);
    reload();
  };

  const deleteIndustry = (id) => {
    if (!confirm('Delete this industry?')) return;
    set('novapack_industries', get('novapack_industries').filter(i => i.id !== id));
    reload();
  };

  const updateSampleStatus = (idx, status) => {
    const list = get('novapack_sample_requests');
    list[idx] = { ...list[idx], status };
    set('novapack_sample_requests', list);
    reload();
  };

  if (!user || !isAdmin) return null;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: `Products (${products.length})` },
    { id: 'industries', label: `Industries (${industries.length})` },
    { id: 'samples', label: `Sample Requests (${samples.length})` },
    { id: 'users', label: `Users (${users.length})` },
  ];

  const pending = samples.filter(s => s.status === 'pending').length;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <div className={styles.heroBadge}>Admin Panel</div>
              <h1 className={styles.heroTitle}>NovaPack Dashboard</h1>
              <p className={styles.heroSub}>Manage products, industries, and customer requests</p>
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">

          {/* Overview cards */}
          {tab === 'overview' && (
            <div className={styles.overviewGrid}>
              {[
                { label: 'Total Products', value: products.length, color: '#14b8a6', icon: '📦', action: () => setTab('products') },
                { label: 'Industries', value: industries.length, color: '#8b5cf6', icon: '🏭', action: () => setTab('industries') },
                { label: 'Sample Requests', value: samples.length, color: '#f59e0b', icon: '📬', action: () => setTab('samples') },
                { label: 'Pending Requests', value: pending, color: '#ef4444', icon: '⚠️', action: () => setTab('samples') },
                { label: 'Registered Users', value: users.length, color: '#10b981', icon: '👥', action: () => setTab('users') },
              ].map(c => (
                <button key={c.label} className={styles.overviewCard} onClick={c.action}>
                  <div className={styles.overviewIcon} style={{ background: `${c.color}18`, color: c.color }}>{c.icon}</div>
                  <div className={styles.overviewValue} style={{ color: c.color }}>{c.value}</div>
                  <div className={styles.overviewLabel}>{c.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map(t => (
              <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
                {t.id === 'samples' && pending > 0 && <span className={styles.badge}>{pending}</span>}
              </button>
            ))}
          </div>

          {/* ── Products tab ── */}
          {tab === 'products' && (
            <section>
              {productForm ? (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>{productForm === 'new' ? 'Add New Product' : 'Edit Product'}</h2>
                  <ProductForm initial={productForm === 'new' ? null : productForm} onSave={saveProduct} onCancel={() => setProductForm(null)} />
                </div>
              ) : (
                <>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Products</h2>
                    <button className={styles.addBtn} onClick={() => setProductForm('new')}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Add Product
                    </button>
                  </div>
                  <div className={styles.productGrid}>
                    {products.map(p => (
                      <div key={p.id} className={styles.productCard}>
                        <div className={styles.productImg}>
                          {p.image
                            ? <img src={p.image} alt={p.name} />
                            : <div className={styles.productImgFallback}>📦</div>
                          }
                        </div>
                        <div className={styles.productBody}>
                          <div className={styles.productCat}>{p.category}</div>
                          <h3 className={styles.productName}>{p.name}</h3>
                          <p className={styles.productDesc}>{p.description}</p>
                          <div className={styles.productMeta}>
                            {p.material && <span className={styles.metaTag}>{p.material}</span>}
                            {p.boxType && <span className={styles.metaTag}>{p.boxType}</span>}
                            {p.finish && <span className={styles.metaTag}>{p.finish}</span>}
                          </div>
                          <div className={styles.productFooter}>
                            <div>
                              <div className={styles.productPrice}>${Number(p.price).toFixed(2)}<span className={styles.productPriceSub}>/unit</span></div>
                              <div className={styles.productMoq}>MOQ: {p.moq} units</div>
                            </div>
                            <div className={styles.productActions}>
                              <button onClick={() => setProductForm(p)} className={styles.editBtn}>Edit</button>
                              <button onClick={() => deleteProduct(p.id)} className={styles.deleteBtn}>Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && <div className={styles.empty}>No products yet. Add one above.</div>}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Industries tab ── */}
          {tab === 'industries' && (
            <section>
              {industryForm ? (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>{industryForm === 'new' ? 'Add Industry' : 'Edit Industry'}</h2>
                  <IndustryForm initial={industryForm === 'new' ? null : industryForm} onSave={saveIndustry} onCancel={() => setIndustryForm(null)} />
                </div>
              ) : (
                <>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Industries</h2>
                    <button className={styles.addBtn} onClick={() => setIndustryForm('new')}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Add Industry
                    </button>
                  </div>
                  <div className={styles.industryGrid}>
                    {industries.map(ind => (
                      <div key={ind.id} className={styles.industryCard}>
                        <div className={styles.industryImg}>
                          {ind.image ? <img src={ind.image} alt={ind.name} /> : <div className={styles.productImgFallback}>🏭</div>}
                        </div>
                        <div className={styles.industryBody}>
                          <h3 className={styles.industryName}>{ind.name}</h3>
                          <p className={styles.industryDesc}>{ind.description}</p>
                          <div className={styles.productActions} style={{ marginTop: 'auto' }}>
                            <button onClick={() => setIndustryForm(ind)} className={styles.editBtn}>Edit</button>
                            <button onClick={() => deleteIndustry(ind.id)} className={styles.deleteBtn}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {industries.length === 0 && <div className={styles.empty}>No industries yet.</div>}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Sample Requests tab ── */}
          {tab === 'samples' && (
            <section>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Sample Requests</h2>
                {samples.length > 0 && <span className={styles.countPill}>{samples.length} total</span>}
              </div>
              {samples.length === 0 ? (
                <div className={styles.empty}>No sample requests received yet.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th><th>Email</th><th>Phone</th><th>Product</th><th>Address</th><th>Date</th><th>Status</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {samples.map((s, i) => (
                        <tr key={i}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.email}</td>
                          <td>{s.phone}</td>
                          <td>{s.productName || '—'}</td>
                          <td className={styles.addressCell}>{s.address}</td>
                          <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={styles.statusPill} data-status={s.status || 'pending'}>
                              {s.status || 'pending'}
                            </span>
                          </td>
                          <td>
                            <select
                              className={styles.statusSelect}
                              value={s.status || 'pending'}
                              onChange={e => updateSampleStatus(i, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── Users tab ── */}
          {tab === 'users' && (
            <section>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Registered Users</h2>
                <span className={styles.countPill}>{users.length} users</span>
              </div>
              {users.length === 0 ? (
                <div className={styles.empty}>No registered users yet.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Role</th><th>Member Since</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td><span className={styles.rolePill}>{u.role}</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
