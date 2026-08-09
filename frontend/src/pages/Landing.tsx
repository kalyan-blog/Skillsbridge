import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Zap, TrendingUp, Compass, Check } from 'lucide-react'
import { Logo } from '../components/Logo'

const Landing = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const features = [
    {
      icon: Zap,
      title: 'Instant Skill Analysis',
      description: 'Upload your resume or manually enter skills. AI instantly analyzes your profile.',
    },
    {
      icon: TrendingUp,
      title: 'Career Gap Report',
      description: 'See exactly which skills match your target role and which ones you need to master.',
    },
    {
      icon: Compass,
      title: 'Personalized Roadmap',
      description: 'Get a step-by-step learning path tailored to your schedule and skill level.',
    },
  ]

  const careerRoles = [
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'AI Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Cloud Engineer',
    'Cybersecurity Analyst',
    'Software Engineer',
  ]

  const faqs = [
    {
      question: 'How does SkillBridge analyze my skills?',
      answer:
        'SkillBridge uses advanced AI to extract skills from your resume or manual input, then compares them against industry requirements for your target role using our comprehensive skill database.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, we use enterprise-grade security with encrypted storage and never share your data with third parties. Your privacy is our priority.',
    },
    {
      question: 'Can I change my target role later?',
      answer:
        'Absolutely! You can analyze against multiple roles anytime. Each analysis is saved in your history for easy comparison.',
    },
    {
      question: 'Does SkillBridge provide learning resources?',
      answer:
        'While we focus on gap analysis and roadmaps, our community features link to curated resources. We integrate with major learning platforms.',
    },
    {
      question: 'How long does analysis take?',
      answer: 'Usually 30-60 seconds for resume upload and analysis. Instant for manual skill entry.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SkillBridge AI
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-violet-600 hover:text-violet-700 font-medium">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bridge the Gap Between{' '}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Your Skills
            </span>
            {' '}and Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Dream Career</span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            SkillBridge AI analyzes your skills or resume, identifies missing job-ready skills, and
            creates a personalized roadmap to help you reach your target role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup" className="btn-primary">
              Analyze My Skills →
            </Link>
            <button className="btn-secondary">
              Explore Career Paths →
            </button>
          </div>

          {/* Hero Animation Placeholder */}
          <div className="relative h-96 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 border border-blue-200 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Animated circles */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full border-4 border-violet-400 animate-pulse" style={{
                  animationDelay: '0.2s',
                }}></div>
                <div className="absolute inset-8 rounded-full border-4 border-pink-400 animate-pulse" style={{
                  animationDelay: '0.4s',
                }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Logo size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Upload Skills', desc: 'Share your resume or enter skills manually' },
              { step: '2', title: 'Select Role', desc: 'Choose your target career path' },
              { step: '3', title: 'AI Analysis', desc: 'Our AI analyzes your skill gaps instantly' },
              {
                step: '4',
                title: 'Get Roadmap',
                desc: 'Receive personalized learning roadmap',
              },
            ].map((item, i) => (
              <div key={i} className="card text-center relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-white font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
                {i < 3 && (
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                    <ChevronDown className="w-6 h-6 text-slate-300 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="card">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 mb-4">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Supported Roles */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Supported Career Paths</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {careerRoles.map((role, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all cursor-pointer text-center font-medium text-slate-700"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-white text-center">
            {[
              { number: '10K+', label: 'Students Analyzed' },
              { number: '50+', label: 'Career Paths' },
              { number: '500+', label: 'Skills Tracked' },
              { number: '4.8★', label: 'User Rating' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto card-gradient text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Bridge Your Skills Gap?</h2>
          <p className="text-slate-700 mb-8">
            Join thousands of students getting job-ready with SkillBridge AI today.
          </p>
          <Link to="/signup" className="btn-primary inline-block">
            Start Your Analysis Now
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full p-6 rounded-lg border border-slate-200 hover:border-violet-400 text-left transition-all hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      openFAQ === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openFAQ === i && (
                  <p className="text-slate-600 mt-4 leading-relaxed">{faq.answer}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo size="sm" />
                <span className="font-bold text-white">SkillBridge AI</span>
              </div>
              <p className="text-sm">Bridge the gap between your skills and your dream career.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 SkillBridge AI. All rights reserved. Know where you are. See where you need to go. Build the skills to get there.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
