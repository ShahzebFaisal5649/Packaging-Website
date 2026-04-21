import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useIntersection } from '../hooks/useIntersection';
import styles from './HowItWorksPage.module.css';

// Visual Assets (reusing placeholders for reliability, but matching the structure)
const supportJoe = 'https://99designs-start-assets.imgix.net/images/common/support/joe-84496f0124.png?auto=format';
const briefImg = 'https://99designs-start-assets.imgix.net/images/how-it-works/brief-ca6a6a7a2d.png?auto=format';
const collaborateImg = 'https://99designs-start-assets.imgix.net/images/how-it-works/collaborate-blue-06ebf51a8d.png?auto=format';
const skullImg = 'https://99designs-start-assets.imgix.net/images/artwork-heroes/skull_pineapple-e2818903de.png?auto=format';

function AnimatedSection({ children, className, id }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  return (
    <div id={id} ref={ref} className={`${className} ${isVisible ? styles.visible : styles.hidden}`}>
      {children}
    </div>
  );
}

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accOpen : ''}`}>
      <button className={styles.accHeader} onClick={() => setIsOpen(!isOpen)}>
        <p>{title}</p>
        <div className={styles.accIcon} />
      </button>
      <div className={styles.accBody} style={{ maxHeight: isOpen ? '500px' : '0' }}>
        <div className={styles.accPadding}>{children}</div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState('brief');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['brief', 'connect', 'collaborate'];
      const scrollPos = window.scrollY + 200;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveStep(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        {/* BREADCRUMBS */}
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
            <a href="/">Home</a>
            <span>/</span>
            <span className={styles.activeCrumb}>How it Works</span>
          </nav>
        </div>

        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={styles.heroShape1} />
          <div className={styles.heroShape2} />
          <div className="container">
            <div className={styles.heroRow}>
              <div className={styles.heroColumn}>
                <div className={styles.revealUp}>
                  <h1 className={styles.heroTitle}>How it works</h1>
                  <p className={styles.heroLead}>
                    We make great design work happen with our global community of professional designers. 
                    If you'd like to speak to a human, <a href="/design-consultation">talk to one of our design experts</a>.
                  </p>
                </div>
              </div>
              <div className={styles.heroColumn}>
                <div className={styles.videoPlaceholder}>
                  <div className={styles.playButton} />
                  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format" alt="How it works video" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY NAV BAR */}
        <div className={styles.stickyBarWrapper}>
          <div className={styles.stickyBar}>
            <div className="container">
              <div className={styles.stickyInner}>
                <ul className={styles.navLinks}>
                  <li className={activeStep === 'brief' ? styles.navActive : ''}>
                    <a href="#brief">1. Brief</a>
                  </li>
                  <li className={activeStep === 'connect' ? styles.navActive : ''}>
                    <a href="#connect">2. Connect</a>
                  </li>
                  <li className={activeStep === 'collaborate' ? styles.navActive : ''}>
                    <a href="#collaborate">3. Collaborate</a>
                  </li>
                </ul>
                <a href="/categories" className={styles.stickyCta}>Get started</a>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: BRIEF */}
        <section id="brief" className={styles.stepSection}>
          <div className="container">
            <div className={styles.stepLayout}>
              <div className={styles.stepNumber} style={{ color: '#408849' }}>1</div>
              <div className={styles.stepContent}>
                <h2 className={styles.sectionTitle}>Tell us what you need designed</h2>
                <p className={styles.sectionText}>Start by creating a simple brief to help designers understand your design needs</p>
                <ul className={styles.checklist}>
                  <li>Only takes a few minutes</li>
                  <li>Captures your style and specs</li>
                  <li>From super simple to crazy complex projects</li>
                </ul>

                <img src={briefImg} alt="Brief illustration" className={styles.stepIllustration} />

                <div className={styles.faqList}>
                  <AccordionItem title="What can I get designed?">
                    Pretty much anything! Our professional designers can create logos, branding, websites, packaging and more. <a href="/categories">Take a look at all of our categories</a>.
                  </AccordionItem>
                  <AccordionItem title="How long does it take?">
                    Quick turnaround for simple tasks, longer timelines for big projects.
                  </AccordionItem>
                  <AccordionItem title="How much does it cost?">
                    Every design category has flexible pricing for all budgets. <a href="/logo-design">Logo design</a> starts at US$299. <a href="/categories">Start by choosing a category</a>.
                  </AccordionItem>
                </div>
                <a href="/faqs" className={styles.readMore}>Read more FAQs</a>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: CONNECT */}
        <section id="connect" className={styles.stepSection} style={{ borderTop: '1px solid #eee' }}>
          <div className="container">
            <div className={styles.stepLayout}>
              <div className={styles.stepNumber} style={{ color: '#9B26AF' }}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.centerHeader}>
                  <h2 className={styles.sectionTitle}>Work with the best designers</h2>
                  <p className={styles.sectionText}>We offer amazing ways to work with our community of professional graphic designers.</p>
                </div>

                <div className={styles.comparisonRow}>
                  {/* HIRE */}
                  <AnimatedSection className={styles.comparisonCol}>
                    <div className={styles.colHeader}>
                      <h3 className={styles.smallHeading}>Hire a designer</h3>
                      <p className={styles.colText}>We’ll help you find a designer you’ll love so you can collaborate together closely on your brief.</p>
                    </div>
                    <div className={styles.designerCardSimple}>
                      <div className={styles.avatarMini} />
                      <div className={styles.designerInfo}>
                        <strong>jpsdesign</strong>
                        <span className={styles.pillPlatinum}>Top Level</span>
                      </div>
                    </div>
                    <ul className={styles.checklist}>
                      <li>Design experts in over 90 skill sets</li>
                      <li>Review portfolios and request quotes</li>
                      <li>All designers vetted for quality</li>
                    </ul>
                    <div className={styles.faqList}>
                      <AccordionItem title="We recommend this for...">
                        People with a clear idea of the style and art direction of their project.
                      </AccordionItem>
                      <AccordionItem title="How much do designers charge?">
                        It varies depending on your design needs. You can request quotes from multiple designers.
                      </AccordionItem>
                    </div>
                  </AnimatedSection>

                  {/* CONTEST */}
                  <AnimatedSection className={styles.comparisonCol}>
                    <div className={styles.colHeader}>
                      <h3 className={styles.smallHeading}>Start a contest</h3>
                      <p className={styles.colText}>Open your brief to our entire design community. Designers submit ideas and you pick your favorite design.</p>
                    </div>
                    <div className={styles.contestMockup}>
                      <div className={styles.mockInner} />
                    </div>
                    <ul className={styles.checklist}>
                      <li>Creative concepts from multiple designers</li>
                      <li>Select one design to own</li>
                      <li>100% money-back guarantee</li>
                    </ul>
                    <div className={styles.faqList}>
                      <AccordionItem title="We recommend this for...">
                        People who want to explore different ideas, styles and concepts.
                      </AccordionItem>
                      <AccordionItem title="How much are contests?">
                        We have design packages for every budget. See pricing packages.
                      </AccordionItem>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: COLLABORATE */}
        <section id="collaborate" className={styles.stepSection} style={{ borderTop: '1px solid #eee' }}>
          <div className="container">
            <div className={styles.stepLayout}>
              <div className={styles.stepNumber} style={{ color: '#424FAD' }}>3</div>
              <div className={styles.stepContent}>
                <h2 className={styles.sectionTitle}>Finalize your design and continue working together</h2>
                <p className={styles.sectionText}>Once you’re happy with your design, you can begin discussing your next project together.</p>
                <ul className={styles.checklist}>
                  <li>Securely release payment upon completion</li>
                  <li>Production ready files for print and digital</li>
                  <li>Copyright and ownership is all yours</li>
                </ul>

                <div className={styles.commsShowcase}>
                   <img src={collaborateImg} alt="Collaboration" className={styles.collabImg} />
                   <div className={styles.chatBubbles}>
                     <div className={styles.bubble}>Hey, can you make it yellow?</div>
                     <div className={`${styles.bubble} ${styles.reply}`}>You got it, how’s that?</div>
                   </div>
                </div>

                <div className={styles.faqList}>
                  <AccordionItem title="What files do I need?">
                    You'll get digital (RGB) and print-ready (CMYK) files (AI, PDF, PSD, JPG, PNG).
                  </AccordionItem>
                  <AccordionItem title="Where are my design files stored?">
                    Conveniently and securely stored in your work area for download anytime.
                  </AccordionItem>
                </div>
                
                <div className={styles.stepCenterBtn}>
                  <a href="/categories" className={styles.btnJumbo}>Get started</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SO, WHY US? */}
        <section className={styles.whyUs}>
          <div className="container">
            <h2 className={`${styles.sectionTitle} ${styles.forrest}`}>So, why us?</h2>
            <div className={styles.whyGrid}>
              <div className={styles.whyItem}>
                <h3><span className={styles.iconStar} /> 4.8/5 rating</h3>
                <p>That’s our average customer rating from 37,643 reviews. Happy designers = happy customers.</p>
                <h3><span className={styles.iconHeart} /> 100% love it</h3>
                <p>Work with award winning designers and get a design you'll love.</p>
              </div>
              <div className={styles.whyItem}>
                <h3><span className={styles.iconPin} /> 24/7 creativity</h3>
                <p>Professional graphic designers available worldwide from Frankfurt to Frankston.</p>
                <h3><span className={styles.iconDesign} /> 90+ design categories</h3>
                <p>Our talented community can design everything from an iOS app to a wine label.</p>
              </div>
              <div className={styles.whyItem}>
                 <img src={skullImg} alt="Skull illustration" className={styles.skullImg} />
              </div>
            </div>
            <div className={styles.stepCenterBtn}>
              <a href="/categories" className={`${styles.btnJumbo} ${styles.btnForest}`}>Get started</a>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL PREVIEW */}
        <section className={styles.testimonialSection}>
          <div className="container">
            <blockquote className={styles.bigQuote}>
              <h2>Working with 99designs was a breeze!</h2>
              <p>I was so pleased to find a bunch of designers who actually wanted to follow my design brief and provide the perfect book cover. I am so thankful I chose to use 99designs!</p>
              <cite>— Madeline Drew, Author</cite>
            </blockquote>
          </div>
        </section>

        {/* QUESTIONS / SUPPORT */}
        <section className={styles.supportSection}>
          <div className="container">
            <div className={styles.supportRow}>
              <div className={styles.supportImgWrap}>
                <img src={supportJoe} alt="Support" />
              </div>
              <div className={styles.supportContent}>
                <h2 className={styles.supportTitle}>Questions?</h2>
                <p className={styles.sectionText}>
                    Our support gurus are here to help you achieve design enlightenment. 
                    Check out our <a href="/help">FAQs</a>, <a href="/email">send us an email</a>, or give us a call.
                </p>
                <div className={styles.supportLinks}>
                  <p className={styles.phoneLink}>1 800 513 1678</p>
                  <a href="/consultation" className={styles.consultBtn}>Free design consultation</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRESS LOGOS */}
        <section className={styles.pressSection}>
          <div className="container">
             <div className={styles.pressGrid}>
               <span>WSJ</span>
               <span>TechCrunch</span>
               <span>Entrepreneur</span>
               <span>NYT</span>
               <span>Forbes</span>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
