import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { 
  Brain, 
  TrendingUp, 
  RefreshCw, 
  Box, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Star,
  Zap,
  Eye,
  ChevronRight,
  Mail,
  Timer,
  Sparkles,
  Loader2,
  AlertCircle,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Send
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import agentLogo from 'figma:asset/4c70b79f3e90d189c405645e9b11abcdaf862ca0.png';
import { dataService } from '../services/localDataService';
import { toast } from 'sonner@2.0.3';

interface CountdownState {
  spotsLeft: number;
  isAnimating: boolean;
}

const socialMediaLinks = [
  { 
    icon: Instagram, 
    name: 'Instagram', 
    url: 'https://www.instagram.com/agen.t1236?igsh=MTd6d2VrNHQxNjRs',
    color: 'hover:text-pink-400'
  },
  { 
    icon: Facebook, 
    name: 'Facebook', 
    url: 'https://www.facebook.com/share/1CLgC5cai7/',
    color: 'hover:text-blue-500'
  },
  { 
    icon: Twitter, 
    name: 'X (Twitter)', 
    url: 'https://x.com/Agent_tech1?t=zvr1iUGJPkOSzq6fbvs-3Q&s=09',
    color: 'hover:text-sky-400'
  },
  { 
    icon: Youtube, 
    name: 'YouTube', 
    url: 'https://youtube.com/@agent-f1c9h?si=XQzRrk9YjpmTVaQX',
    color: 'hover:text-red-500'
  }
];

const propertyTypes = [
  "Moving Within State",
  "Relocating to New State", 
  "Short-term Rental (1-6 months)",
  "Long-term Rental (6+ months)",
  "Corporate Relocation",
  "Student Housing"
];

const propertyImages = [
  {
    type: "Modern Apartments",
    url: "https://images.unsplash.com/photo-1709630998478-7c310df16bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzU5NzQ4MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Search by State > LGA > Community"
  },
  {
    type: "Luxury Homes",
    url: "https://images.unsplash.com/photo-1656838611814-3b0bd9c3f6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVudCUyMGNlbnRlciUyMHZlbnVlfGVufDF8fHx8MTc1OTc0ODExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Flexible lease terms from months to years"
  },
  {
    type: "Student Housing",
    url: "https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NDgxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Transparent pricing with no hidden fees"
  },
  {
    type: "Family Residences",
    url: "https://images.unsplash.com/photo-1620735692151-26a7e0748429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBlbGVnYW50JTIwc3BhY2V8ZW58MXx8fHwxNzU5NzQ4MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Professional vetting for peace of mind"
  },
  {
    type: "Corporate Housing",
    url: "https://images.unsplash.com/photo-1557804500-7a58fbcd4d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbSUyMG1lZXRpbmclMjBzcGFjZXxlbnwxfHx8fDE3NTk3NDgxMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Seamless relocation support nationwide"
  }
];

const features = [
  {
    icon: Eye,
    title: "Precise Location Search",
    description: "Find your perfect home by filtering State → Local Government Area → Community. Pinpoint exactly where you want to live.",
    gradient: "from-cyan-400 to-blue-500",
    modalTitle: "Location-First Search Technology",
    modalDescription: "Our revolutionary search system lets you find properties with unprecedented precision.",
    benefits: [
      "Search by State, Local Government Area, and Community",
      "Interactive map integration with neighborhood insights",
      "Filter by proximity to schools, hospitals, and transit",
      "View demographic and safety data for each area",
      "Save favorite locations for instant updates",
      "Get notifications when properties match your criteria"
    ]
  },
  {
    icon: CheckCircle,
    title: "100% Vetted Rentals", 
    description: "Every apartment is physically inspected with professional videos and 3D tours before listing. No surprises.",
    gradient: "from-emerald-400 to-teal-500",
    modalTitle: "Professional Property Vetting",
    modalDescription: "Every property undergoes rigorous inspection before appearing on our platform.",
    benefits: [
      "Physical inspection by certified professionals",
      "Complete 4K video walkthrough of every room",
      "Interactive 3D virtual tour technology",
      "Verified photos with timestamps",
      "Legal document verification and compliance check",
      "Landlord background and credibility screening"
    ]
  },
  {
    icon: Zap,
    title: "Escrow Protection",
    description: "Your money is held securely until property delivery. Complete peace of mind with legal protection.",
    gradient: "from-purple-400 to-indigo-500",
    modalTitle: "Secure Escrow & Payment Protection",
    modalDescription: "Your funds are protected with bank-grade escrow services until you get your keys.",
    benefits: [
      "Funds held in secure escrow until move-in",
      "Money released only after property inspection",
      "Full refund protection for misrepresented properties",
      "Legal contract review and verification",
      "Transparent 15% service fee with no hidden costs",
      "24/7 payment dispute resolution support"
    ]
  },
  {
    icon: Users,
    title: "Seamless Relocation",
    description: "Moving to a new state? Our detailed location filters and vetting make long-distance moves effortless.",
    gradient: "from-orange-400 to-red-500",
    modalTitle: "End-to-End Relocation Support",
    modalDescription: "Relocating across states has never been easier with our comprehensive support.",
    benefits: [
      "Virtual property tours from anywhere in the world",
      "Dedicated relocation specialist support",
      "Local area guides and neighborhood insights",
      "Moving company partnerships and discounts",
      "Utility setup and transfer assistance",
      "Post-move support for first 30 days"
    ]
  }
];

const perks = [
  "Early access to our vetted property database",
  "Exclusive launch pricing and benefits", 
  "Priority customer support from our team"
];

const testimonials = [
  {
    quote: "Moving to a new state was stressful until I found AGENT. The location search helped me find the perfect community, and the 3D tours let me see everything remotely.",
    author: "Sarah M.",
    role: "Remote Renter",
    badge: "Beta User"
  }
];

export default function AgentWaitlist() {
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [finalEmail, setFinalEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<CountdownState>({ spotsLeft: 147, isAnimating: false });
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const techRef = useRef(null);
  const ctaRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isTechInView = useInView(techRef, { once: true });
  const isCtaInView = useInView(ctaRef, { once: true });
  
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Fetch current waitlist count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await dataService.getWaitlistCount();
        setCountdown({ spotsLeft: data.spotsLeft, isAnimating: false });
      } catch (error) {
        console.log('Error fetching waitlist count:', error);
      }
    };

    fetchCount();
  }, []);

  // Animate countdown occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (Math.random() < 0.3 && prev.spotsLeft > 120) {
          return { spotsLeft: prev.spotsLeft - 1, isAnimating: true };
        }
        return { ...prev, isAnimating: false };
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const submitToWaitlist = async (emailToSubmit: string) => {
    setIsLoading(true);
    setError('');

    // Check if admin email and redirect to dashboard immediately
    if (dataService.isAdmin(emailToSubmit)) {
      toast.success('Welcome Admin!', {
        description: 'Redirecting you to the dashboard...'
      });
      setTimeout(() => {
        window.location.href = '/?dashboard=true';
      }, 1000);
      setIsLoading(false);
      return true;
    }

    try {
      const response = await dataService.submitToWaitlist(
        emailToSubmit,
        propertyType || 'General Interest'
      );

      if (!response.success) {
        if (response.alreadyExists) {
          setError("You're already on the waitlist! Check your email for confirmation.");
          toast.error("You're already registered!", {
            description: "You can't register twice with the same email address."
          });
        } else {
          setError(response.error || 'Failed to join waitlist');
          toast.error(response.error || 'Failed to join waitlist');
        }
        return false;
      }

      setQueuePosition(response.queuePosition || 1);
      setIsSubmitted(true);
      toast.success('Successfully joined the waitlist!', {
        description: 'Welcome to AGENT! Get ready for the future of apartment hunting.'
      });
      
      // Update spots left
      setCountdown(prev => ({ ...prev, spotsLeft: Math.max(0, prev.spotsLeft - 1) }));
      
      return true;
    } catch (error) {
      console.error('Waitlist signup error:', error);
      setError('Unable to join waitlist. Please try again.');
      toast.error('Signup Failed', {
        description: 'Please try again or contact support.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isFinal = false) => {
    e.preventDefault();
    
    if (isFinal) {
      if (finalEmail) {
        await submitToWaitlist(finalEmail);
      }
    } else {
      if (email && propertyType) {
        const success = await submitToWaitlist(email);
        if (!success) {
          // If submission failed, scroll to final CTA for retry
          ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1A2F] via-[#1a237e] to-[#0F1A2F] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-[#00F5FF] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-[#0F1A2F]" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">You're In!</h2>
          <p className="text-gray-300 mb-6">
            You are <span className="text-[#00F5FF] font-bold">#{queuePosition}</span> in the queue
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p>
                    <strong className="text-white">Check your email!</strong> We've sent you a confirmation with all the details about AGENT and what to expect.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    (Don't forget to check your spam/junk folder if you don't see it within 5 minutes)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
                <p className="text-left">Get exclusive updates on our launch progress and early access perks</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
                <p className="text-left">Be first to browse vetted properties when we launch in 3 months</p>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
                <p className="text-left">Follow us on social media for behind-the-scenes updates</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Welcome to the future of apartment hunting! 🏠
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#0F1A2F] text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Bar - Enhanced with white glow */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-white via-[#00F5FF] to-white z-50 shadow-lg shadow-[#00F5FF]/50"
        style={{ width: progressWidth }}
      />

      {/* Floating Glassmorphic Background Elements - FASTER & BRIGHTER */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -80, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/15 via-[#00F5FF]/25 to-white/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -120, 0], 
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#00F5FF]/25 via-white/15 to-[#00F5FF]/25 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section - Simple Centered Waitlist */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Skyscraper Background */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1753097955679-592a3457b7c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYmx1ZSUyMGdsYXNzJTIwc2t5c2NyYXBlciUyMG5pZ2h0JTIwY2l0eXxlbnwxfHx8fDE3NTk5MTMzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern Skyscraper"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-[#0F1A2F]/60 backdrop-blur-[1px]" />
          {/* Gradient overlay to blend with brand colors */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A2F]/40 via-transparent to-[#0F1A2F]/80" />
          
          {/* Expanding gradient light effect - FASTER */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-white/30 via-[#00F5FF]/30 to-transparent rounded-full blur-3xl"
          />
          
          {/* Floating particles for depth and movement */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            {/* AGENT Logo - Using hierarchy and balance principles with WHITE CONTRAST */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
              className="flex justify-center mb-6 md:mb-10"
            >
              <div className="relative group">
                {/* Glowing backdrop - FASTER animation */}
                <motion.div 
                  className="absolute -inset-4 bg-gradient-to-r from-[#00F5FF]/40 via-white/20 to-[#00F5FF]/40 rounded-3xl blur-3xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Logo container - CONTRAST PRINCIPLE with white logo */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border-2 border-white/30 p-4 md:p-6 shadow-2xl group-hover:border-white/50 transition-all duration-300">
                  <motion.img 
                    src={agentLogo} 
                    alt="AGENT - Location-First Rental Platform" 
                    className="w-48 h-auto sm:w-56 md:w-64 lg:w-72 object-contain"
                    style={{
                      filter: 'brightness(5) contrast(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(0, 245, 255, 0.6))'
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                </div>
                
                {/* Accent elements - FASTER pulses */}
                <motion.div 
                  className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg shadow-white/80"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-2 -left-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#00F5FF] rounded-full shadow-lg shadow-[#00F5FF]/80"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                />
              </div>
            </motion.div>

            {/* Launch Badge - FASTER reveal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex justify-center"
            >
              <Badge className="bg-gradient-to-r from-[#00F5FF]/30 to-white/20 text-white border-2 border-white/40 px-6 py-2 text-sm backdrop-blur-md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                </motion.div>
                Launching in 3 Months
              </Badge>
            </motion.div>

            {/* Headline - FASTER staggered reveal */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-2">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="inline-block"
                >
                  Find Your Perfect Home.{' '}
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-white via-[#00F5FF] to-white bg-clip-text text-transparent inline-block"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.35, duration: 0.4, type: "spring", stiffness: 200 }}
                >
                  Anywhere.
                </motion.span>
              </h1>
              <motion.p 
                className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto px-2"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                The location-first rental platform with professional vetting, 3D tours, 
                and escrow protection. Search by State → LGA → Community.
              </motion.p>
            </motion.div>

            {/* Waitlist Form - FASTER reveal with enhanced glow */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-white/30 max-w-md mx-auto relative overflow-hidden"
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { y: 0, opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 245, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-white/10 opacity-50"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 sm:pl-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-gray-300 h-11 sm:h-12 text-sm sm:text-base text-center focus:bg-white/25 focus:border-[#00F5FF]/50 transition-all duration-300"
                    required
                  />
                </div>

                <Select value={propertyType} onValueChange={setPropertyType} required>
                  <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white h-11 sm:h-12 text-sm sm:text-base focus:bg-white/25 focus:border-[#00F5FF]/50 transition-all duration-300">
                    <SelectValue placeholder="What's your rental situation?" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1A2F]/95 backdrop-blur-xl border-white/20">
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-white/10 focus:bg-white/10">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="relative">
                  {/* FASTER pulsing glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-white/60 via-[#00F5FF] to-white/60 rounded-xl blur-lg"
                    animate={{ 
                      opacity: [0.4, 0.7, 0.4],
                      scale: [0.98, 1.02, 0.98]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-white to-[#00F5FF] hover:from-[#00F5FF] hover:to-white text-[#0F1A2F] font-bold rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-white/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-white/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <motion.div 
                          className="inline-block ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-300 text-center">
                Be the first to experience the future of apartment hunting
              </p>
            </motion.form>

            {/* Urgency Counter - FASTER reveal */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm"
            >
              <motion.div 
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                animate={{ 
                  boxShadow: countdown.isAnimating 
                    ? ['0 0 0 0 rgba(0, 245, 255, 0.4)', '0 0 0 10px rgba(0, 245, 255, 0)']
                    : '0 0 0 0 rgba(0, 245, 255, 0)'
                }}
                transition={{ duration: 0.6 }}
              >
                <Timer className="w-4 h-4 text-[#00F5FF]" />
                <span className="text-gray-300">
                  Only <motion.span 
                    key={countdown.spotsLeft}
                    initial={{ scale: 1.3, color: '#00F5FF' }}
                    animate={{ scale: 1, color: '#fff' }}
                    className="font-semibold"
                  >
                    {countdown.spotsLeft}
                  </motion.span> spots left
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
              >
                <Users className="w-4 h-4 text-[#00F5FF]" />
                <span className="text-gray-300">
                  <span className="font-semibold text-white">{200 - countdown.spotsLeft}</span> already joined
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Property Showcase Section */}
      <section className="py-12 sm:py-16 md:py-20 relative bg-gradient-to-br from-white/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
              Every Community.{' '}
              <span className="bg-gradient-to-r from-white via-[#00F5FF] to-white bg-clip-text text-transparent">
                Every Apartment.
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-2">
              Search precisely by location, see transparent pricing, and choose your perfect lease duration
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-20">
            {propertyImages.slice(0, 5).map((property, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                animate={isFeaturesInView ? { y: 0, opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05, type: "spring" }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-2 border-white/20 hover:border-white/40 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-white/10">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={property.url}
                      alt={property.type}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 sm:mb-2">{property.type}</h3>
                    <p className="text-gray-200 text-xs sm:text-sm">{property.description}</p>
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 bg-[#00F5FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Power Features Section */}
      <section ref={featuresRef} className="py-12 sm:py-16 md:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
              Why Search Anywhere Else?{' '}
              <span className="bg-gradient-to-r from-white via-[#00F5FF] to-white bg-clip-text text-transparent">
                We've Got Everything.
              </span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={isFeaturesInView ? { y: 0, opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.05, type: "spring" }}
                onClick={() => setSelectedFeature(index)}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-2 border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-200 group cursor-pointer h-full shadow-lg shadow-[#00F5FF]/5 hover:shadow-2xl hover:shadow-white/20">
                  <CardContent className="p-4 sm:p-5 md:p-6 text-center space-y-3 sm:space-y-4">
                    <motion.div 
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature.description}</p>
                    <div className="pt-2">
                      <span className="text-[#00F5FF] text-xs sm:text-sm flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                        Learn More <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modals */}
      <TooltipProvider>
        {features.map((feature, index) => (
          <Dialog key={index} open={selectedFeature === index} onOpenChange={(open) => !open && setSelectedFeature(null)}>
            <DialogContent className="bg-[#0F1A2F]/95 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <DialogTitle className="text-2xl font-bold text-white mb-2">{feature.modalTitle}</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      {feature.modalDescription}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#00F5FF] mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Key Benefits
                  </h4>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <CheckCircle className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm text-center">
                    Join the waitlist to get early access to this feature and more!
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </TooltipProvider>

      {/* Visionary Tech Section */}
      <section ref={techRef} className="py-12 sm:py-16 md:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isTechInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
              The Future of Apartment Hunting is{' '}
              <span className="bg-gradient-to-r from-white via-[#00F5FF] to-white bg-clip-text text-transparent">
                Location-First.
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={isTechInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#00F5FF] flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Granular Location Search</h3>
                </div>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  Start with your preferred State, narrow down by Local Government Area, 
                  then pinpoint your exact Community. Find apartments exactly where you want to live.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#00F5FF] flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Complete Transparency</h3>
                </div>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  See clear monthly costs, choose your lease duration, and enjoy flexible terms 
                  with no hidden fees. Every apartment is professionally vetted and documented.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={isTechInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1OTc0ODEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Smart Market Insights"
                  className="w-full rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00F5FF]/20 to-transparent rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof & Countdown Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold px-2">Trusted by Smart Renters</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center border border-white/10">
                    <div className="text-base sm:text-lg font-semibold">500+ Communities</div>
                    <div className="text-xs sm:text-sm text-gray-400">Across multiple states</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center border border-white/10">
                    <div className="text-base sm:text-lg font-semibold">100% Vetted</div>
                    <div className="text-xs sm:text-sm text-gray-400">Apartments with 3D tours</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00F5FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F1A2F]" />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <p className="text-sm sm:text-base text-gray-300 italic leading-relaxed">
                      "{testimonials[0].quote}"
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold">{testimonials[0].author}</span>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="text-gray-400 text-xs sm:text-sm">{testimonials[0].role}</span>
                      <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30 text-xs">
                        {testimonials[0].badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00F5FF]/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-8 border border-[#00F5FF]/20">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <Timer className="w-6 h-6 text-[#00F5FF]" />
                  <h3 className="text-2xl font-bold">Limited Early Access</h3>
                </div>
                
                <p className="text-lg text-gray-300">The first <span className="font-bold text-white">200 early users</span> get:</p>
                
                <div className="space-y-3">
                  {perks.map((perk, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#00F5FF] flex-shrink-0" />
                      <span className="text-gray-300">{perk}</span>
                    </div>
                  ))}
                </div>

                <motion.div
                  animate={countdown.isAnimating ? { scale: [1, 1.1, 1] } : {}}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                >
                  <div className="text-3xl font-bold text-[#00F5FF] mb-2">
                    {countdown.spotsLeft}/200
                  </div>
                  <div className="text-sm text-gray-400">spots claimed</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#0F1A2F] via-[#1a237e] to-[#0F1A2F] relative">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isCtaInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto space-y-6 md:space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
              Ready to Find{' '}
              <span className="bg-gradient-to-r from-white via-[#00F5FF] to-white bg-clip-text text-transparent">
                Your Perfect Home?
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-200 px-2">
              Join the waitlist for AGENT. Precise location search, vetted apartments, and flexible lease terms await.
            </p>

            <motion.form
              onSubmit={(e) => handleSubmit(e, true)}
              className="space-y-4 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={isCtaInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={finalEmail}
                    onChange={(e) => setFinalEmail(e.target.value)}
                    className="pl-10 sm:pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-gradient-to-r from-white to-[#00F5FF] hover:from-[#00F5FF] hover:to-white text-[#0F1A2F] font-bold rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-white/40 hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-white/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Join AGENT Now</span>
                      <span className="sm:hidden">Join Now</span>
                      <motion.div 
                        className="inline-block ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.div>
                    </>
                  )}
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </motion.form>

            <p className="text-sm text-gray-400">
              By joining, you agree to receive updates about AGENT. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer with Social Media */}
      <footer className="py-10 sm:py-12 md:py-16 bg-black/30 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center space-y-6 md:space-y-8">
            {/* Footer Logo - WHITE for CONTRAST */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <motion.img 
                src={agentLogo} 
                alt="AGENT" 
                className="h-10 sm:h-12 w-auto object-contain"
                style={{
                  filter: 'brightness(5) contrast(1.2) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(0, 245, 255, 0.4))'
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            {/* Social Media Icons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
              <span className="text-gray-400 text-xs sm:text-sm">Follow us:</span>
              <TooltipProvider>
                <div className="flex space-x-2 sm:space-x-3">
                  {socialMediaLinks.map((social) => (
                    <Tooltip key={social.name}>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-white/10 hover:border-[#00F5FF]/30 ${social.color}`}
                          aria-label={social.name}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#0F1A2F] border-white/20">
                        <p>{social.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            {/* Footer Text */}
            <div className="text-center space-y-1 sm:space-y-2 px-4">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 AGENT. All rights reserved.
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs">
                The future of apartment hunting starts here.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}