import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationHeader } from "@/components/navigation-header";
import {
  Mail, Phone, Search, AlertTriangle, CheckCircle2, ChevronDown
} from "lucide-react";
import { useState } from "react";
import heroBg from "@/assets/hero_bg.jpg";

const FAQ_ITEMS = [
  { question: "How do I register my homestay?", answer: "How do I register my homestay? What are the permit requirements? What are the permit requirements?" },
  { question: "What are the permit requirements?", answer: "You need valid ID, property documents, and fire safety clearance." },
  { question: "How can I report an issue?", answer: "Use the contact form below or call our helpline during business hours." },
  { question: "Where can I find tourism statistics?", answer: "Visit the HP Tourism official website for detailed statistics and reports." },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <NavigationHeader
        title="HP Tourism Portal"
        subtitle="Homestay & B&B Registration"
        showBack={false}
        showHome
      />

      {/* Hero Section */}
      <div
        style={{
          // Center the image to show mountains
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${heroBg})`,
          backgroundPosition: 'center 60%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // INCREASED TOP PADDING to push text down (highlight image)
          // REDUCED BOTTOM PADDING to push buttons to border
          padding: '220px 20px 60px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '8px', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          How Can We Help You?
        </h1>
        {/* Slogan - Reduced spacing */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: '40px', marginTop: '0px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          Connect with us for support and inquiries
        </h2>

        {/* Buttons - Closer to bottom edge */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a href="tel:01772625924" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 32px', background: 'rgba(30, 58, 138, 0.4)', borderRadius: '50px', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
            <Phone size={18} /> Call Now
          </a>
          <a href="mailto:tourismmin-hp@nic.in" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 32px', background: 'rgba(30, 58, 138, 0.4)', borderRadius: '50px', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
            <Mail size={18} /> Email Us
          </a>
          <a href="/track" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 32px', background: 'rgba(30, 58, 138, 0.4)', borderRadius: '50px', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
            <Search size={18} /> Track Application
          </a>
        </div>
      </div>

      {/* Cards Section - MOVED DOWN (No Overlap) */}
      <div style={{ maxWidth: '1000px', margin: '60px auto 40px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '40px' }}>

          {/* (1) Property Owners */}
          <Card style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 6L6 26H12V54H48V26H54L30 6Z" fill="#15803d" />
                  <path d="M12 26L30 11L48 26" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M22 54V38H38V54" fill="white" />
                  <path d="M52 52C52 52 58 46 58 38C58 32 54 30 50 30C46 30 42 32 42 38C42 46 52 52 52 52Z" fill="#86efac" stroke="white" strokeWidth="2" />
                  <path d="M50 30V52" stroke="#15803d" strokeWidth="1" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#1e293b', marginBottom: '4px' }}>(1) Property Owners</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Register, manage listings, and access resources for tourism properties in Himachal.</p>
                <Button style={{ background: '#15803d', borderRadius: '4px', fontSize: '13px', fontWeight: 600, padding: '8px 24px', height: 'auto' }} asChild>
                  <a href="/services">View Services</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* (2) Department Staff */}
          <Card style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="20" r="12" fill="#1e40af" />
                  <path d="M10 56V44C10 36 18 32 30 32C42 32 50 36 50 44V56H10Z" fill="#1e40af" />
                  <path d="M30 32L26 44H34L30 32Z" fill="white" />
                  <path d="M29 44L30 50L31 44" fill="white" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#1e293b', marginBottom: '4px' }}>(2) Department Staff</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Internal portal for department employees. Access tools and reports.</p>
                <Button style={{ background: '#1e40af', borderRadius: '4px', fontSize: '13px', fontWeight: 600, padding: '8px 24px', height: 'auto' }} asChild>
                  <a href="/login">Staff Login</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* (3) Office Location */}
          <Card style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M6 46L22 40V16L6 22V46Z" fill="#fcd34d" />
                  <path d="M22 40L38 46V22L22 16V40Z" fill="#b45309" />
                  <path d="M38 46L54 40V16L38 22V46Z" fill="#fcd34d" />
                  <path d="M30 36C30 36 22 28 22 18C22 12 26 8 30 8C34 8 38 12 38 18C38 28 30 36 30 36Z" fill="#b45309" stroke="white" strokeWidth="2" />
                  <circle cx="30" cy="18" r="3" fill="white" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#1e293b', marginBottom: '4px' }}>(3) Office Location</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Find our main office and regional centers. Get directions.</p>
                <Button style={{ background: '#b45309', borderRadius: '4px', fontSize: '13px', fontWeight: 600, padding: '8px 24px', height: 'auto' }} asChild>
                  <a href="https://maps.google.com/?q=SDA+Complex+Kasumpti+Shimla" target="_blank" rel="noreferrer">View Map</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* (4) System Status */}
          <Card style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect x="10" y="10" width="40" height="10" rx="2" fill="#7e22ce" />
                  <rect x="14" y="13" width="4" height="4" fill="white" />
                  <rect x="20" y="13" width="4" height="4" fill="white" />
                  <rect x="10" y="24" width="40" height="10" rx="2" fill="#7e22ce" />
                  <rect x="14" y="27" width="4" height="4" fill="white" />
                  <rect x="20" y="27" width="4" height="4" fill="white" />
                  <rect x="10" y="38" width="40" height="10" rx="2" fill="#7e22ce" />
                  <circle cx="44" cy="48" r="10" fill="#a855f7" stroke="white" strokeWidth="2" />
                  <path d="M40 48L42 50L48 44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#1e293b', marginBottom: '4px' }}>(4) System Status</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    <CheckCircle2 size={12} /> All Systems Operational
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Check real-time status of portal services.</p>
                <Button variant="outline" style={{ borderRadius: '4px', fontSize: '13px', fontWeight: 600, padding: '8px 24px', height: 'auto', borderColor: '#d8b4fe', color: '#7e22ce' }} asChild>
                  <a href="/system-status">View Details</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div style={{ background: '#f8fafc', padding: '20px 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: '#1e293b' }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>{faq.question}</span>
                  <ChevronDown size={18} style={{ color: '#94a3b8', transform: openFaq === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 16px 16px', fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Banner */}
        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px', background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
              <AlertTriangle size={20} style={{ color: '#78350f' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#78350f', fontSize: '14px' }}>EMERGENCY ASSISTANCE:</div>
              <div style={{ color: '#92400e', fontSize: '13px' }}>For immediate help during natural disasters or tourism-related emergencies, call our 24/7 helpline at 1077 or 112.</div>
            </div>
          </div>
          <Button style={{ background: '#78350f', color: 'white', borderRadius: '50px', fontSize: '12px', fontWeight: 600, padding: '8px 20px', height: '32px' }}>
            Emergency Contacts
          </Button>
        </div>
      </div>
    </div>
  );
}
