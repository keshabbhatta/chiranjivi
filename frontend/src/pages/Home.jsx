import React from 'react';
import { Box, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BrainIcon from '@mui/icons-material/Psychology'; // represents AI
import StorageIcon from '@mui/icons-material/Storage'; // represents Dataset
import TimelineIcon from '@mui/icons-material/Timeline'; // represents accuracy
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // represents validation
import HubIcon from '@mui/icons-material/Hub'; // represents architecture
import AutoGraphIcon from '@mui/icons-material/AutoGraph'; // represents accuracy performance

// CSS animation defined globally within styled-components or a CSS file is better,
// but for single-file copy-paste, we define keyframes in a style tag below.
const animationDelay = (delay) => ({
  animation: `fadeInUp 0.8s ease-out ${delay}s forwards`,
  opacity: 0,
});

const AboutDirghaayu = () => {
  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        padding: { xs: '4rem 1.5rem', md: '6rem 2rem' }, 
        maxWidth: '1100px', 
        margin: '0 auto',
        color: '#f4f4f5'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 900, 
          letterSpacing: '-0.04em',
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          ...animationDelay(0)
        }}
      >
        Decoding the Chiranjivi Engine
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ color: '#a1a1aa', maxWidth: '750px', margin: '0 auto 5rem auto', lineHeight: 1.8, fontSize: '1.1rem', ...animationDelay(0.2) }}
      >
        Chiranjivi AI leverages state-of-the-art machine learning architectures to provide unparalleled health insights. Our engine analyzes complex symptom patterns against vast medical datasets to deliver rapid, accurate evaluations.
      </Typography>
      
      {/* specialty Offerings Grid - Retained from previous code as requested services portion */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '2.5rem' }}>
        
        {/* Service 1 */}
        <Box sx={{ p: '2.5rem', bgcolor: '#09090b', border: '1px solid #1c1c1f', borderRadius: '20px', textAlign: 'left', ...animationDelay(0.4), transition: '0.3s', '&:hover': {borderColor: '#27272a', transform: 'translateY(-5px)'} }}>
          <LocalDiningIcon sx={{ fontSize: 45, color: '#10b981', mb: 2.5 }} />
          <Typography variant="h6" sx={{ color: '#f4f4f5', fontWeight: 800, mb: 1.5, letterSpacing: '-0.01em' }}>Precision Nutrition</Typography>
          <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7 }}>
            AI-driven dietary analysis that constructs personalized nutritional profiles based on metabolic data, predictive health markers, and lifestyle goals.
          </Typography>
        </Box>

        {/* Service 2 */}
        <Box sx={{ p: '2.5rem', bgcolor: '#09090b', border: '1px solid #1c1c1f', borderRadius: '20px', textAlign: 'left', ...animationDelay(0.5), transition: '0.3s', '&:hover': {borderColor: '#27272a', transform: 'translateY(-5px)'} }}>
          <FitnessCenterIcon sx={{ fontSize: 45, color: '#f59e0b', mb: 2.5 }} />
          <Typography variant="h6" sx={{ color: '#f4f4f5', fontWeight: 800, mb: 1.5, letterSpacing: '-0.01em' }}>Adaptive Conditioning</Typography>
          <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7 }}>
            Dynamic fitness protocols that evolve using biometric feedback loop, ensuring optimal performance gains while minimizing risk of injury.
          </Typography>
        </Box>

        {/* Service 3 */}
        <Box sx={{ p: '2.5rem', bgcolor: '#09090b', border: '1px solid #1c1c1f', borderRadius: '20px', textAlign: 'left', ...animationDelay(0.6), transition: '0.3s', '&:hover': {borderColor: '#27272a', transform: 'translateY(-5px)'} }}>
          <FavoriteIcon sx={{ fontSize: 45, color: '#ef4444', mb: 2.5 }} />
          <Typography variant="h6" sx={{ color: '#f4f4f5', fontWeight: 800, mb: 1.5, letterSpacing: '-0.01em' }}>Cognitive Wellness</Typography>
          <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7 }}>
            Integrated mental health resources employing AI pattern recognition to help identify stress triggers and nurture proactive mental resilience.
          </Typography>
        </Box>

        {/* Service 4 - New AI Tech Focus */}
        <Box sx={{ p: '2.5rem', bgcolor: '#09090b', border: '1px solid #1c1c1f', borderRadius: '20px', textAlign: 'left', ...animationDelay(0.7), transition: '0.3s', '&:hover': {borderColor: '#27272a', transform: 'translateY(-5px)'} }}>
          <BrainIcon sx={{ fontSize: 45, color: '#06b6d4', mb: 2.5 }} />
          <Typography variant="h6" sx={{ color: '#f4f4f5', fontWeight: 800, mb: 1.5, letterSpacing: '-0.01em' }}>Neural Diagnostics</Typography>
          <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7 }}>
            Utilizing deep neural networks for medical pattern matching, providing preliminary symptom analysis with clinical-grade precision.
          </Typography>
        </Box>

      </Box>
    </Box>
  );
};

const HomePage = () => {
  return (
    <div className="bg-black text-gray-100 min-h-screen antialiased font-sans select-none overflow-x-hidden">
      
      {/* Global CSS for page animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulseNeon {
          0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.1); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-neon {
          animation: pulseNeon 4s infinite;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      {/* Hero Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-40 relative">
        
        {/* Animated Medical Image - Top Right */}
        <div className="absolute top-20 right-10 md:right-20 w-64 h-64 md:w-80 md:h-80 opacity-20 md:opacity-100 animate-float pointer-events-none hidden md:block">
          {/* Using an abstract SVG/div structure instead of an image link for reliability */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Inner pulsing core */}
            <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full blur-xl animate-pulse-neon" />
            <div className="absolute w-16 h-16 bg-cyan-500/30 rounded-full blur-lg" />
            
            {/* Rotating medical cross lines */}
            <div className="absolute w-1 h-40 bg-gradient-to-b from-emerald-400 to-transparent rounded-full rotate-45 opacity-60" />
            <div className="absolute w-1 h-40 bg-gradient-to-b from-cyan-400 to-transparent rounded-full -rotate-45 opacity-60" />
            <div className="absolute h-1 w-40 bg-gradient-to-r from-emerald-400 to-transparent rounded-full rotate-12 opacity-60" />
            <div className="absolute h-1 w-40 bg-gradient-to-r from-cyan-400 to-transparent rounded-full -rotate-12 opacity-60" />
            
            {/* Orbiting particles */}
            <div className="absolute w-3 h-3 bg-emerald-300 rounded-full top-10 left-10 blur-[1px]" />
            <div className="absolute w-2 h-2 bg-cyan-300 rounded-full bottom-10 right-10 blur-[1px]" />
            <div className="absolute w-3 h-3 bg-amber-300 rounded-full top-1/2 right-4 blur-[1px]" />
          </div>
        </div>

        {/* Hero Text */}
        <div className="max-w-3xl relative z-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] animate-[fadeInUp_1s_ease-out_forwards] opacity-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Chiranjivi AI
            </span>
            <br />
            <span className="text-white inline-block">Predictive Health</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed animate-[fadeInUp_1s_ease-out_0.2s_forwards] opacity-0">
            Harnessing advanced machine learning to provide rapid symptom analysis and validated medical predictions. Experience the next generation of clinical intelligence.
          </p>
        </div>
      </div>

      {/* Model Stats Section (Replaces Old Cards Section) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-[fadeInUp_1s_ease-out_0.4s_forwards] opacity-0">
          
          {/* Card 1: Core Model */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl group flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm animate-pulse-neon min-h-[280px]">
            <div className="flex justify-between items-center">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl group-hover:scale-110 transition duration-300">
                <BrainIcon fontSize="large" />
              </div>
              <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Engine</span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Core Architecture</h3>
              <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                Utilizes specialized Deep Neural Networks (DNN) trained via supervised learning protocols for multi-label classification.
              </p>
              <div className="mt-4 text-xs font-mono text-emerald-300 bg-emerald-950/50 inline-block px-3 py-1 rounded-md border border-emerald-800">
                Model: Chiranjivi-v1.2-beta
              </div>
            </div>
          </div>

          {/* Card 2: Training Data */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl group flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm min-h-[280px]">
            <div className="flex justify-between items-center">
              <div className="p-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl group-hover:scale-110 transition duration-300">
                <StorageIcon fontSize="large" />
              </div>
              <span className="text-xs font-bold text-cyan-500 tracking-widest uppercase">Training</span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Dataset Scale</h3>
              <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                Trained on millions of anonymized, aggregated medical records and clinical case studies to ensure robust pattern recognition.
              </p>
              <div className="mt-4 text-xs font-mono text-cyan-300 bg-cyan-950/50 inline-block px-3 py-1 rounded-md border border-cyan-800">
                Sources: Global Health Data Exchange (GHDx)
              </div>
            </div>
          </div>

          {/* Card 3: Validation */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl group flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 backdrop-blur-sm min-h-[280px]">
            <div className="flex justify-between items-center">
              <div className="p-4 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl group-hover:scale-110 transition duration-300">
                <VerifiedUserIcon fontSize="large" />
              </div>
              <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">Validation</span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Cross-Validation</h3>
              <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                Employs K-Fold cross-validation methods to minimize bias and maximize the model's ability to generalize to new data.
              </p>
              <div className="mt-4 text-xs font-mono text-amber-300 bg-amber-950/50 inline-block px-3 py-1 rounded-md border border-amber-800">
                Method: 10-Fold CV / Stratified
              </div>
            </div>
          </div>

          {/* Card 4: Accuracy */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl group flex flex-col justify-between hover:border-red-500/30 transition-all duration-300 backdrop-blur-sm min-h-[280px]">
            <div className="flex justify-between items-center">
              <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl group-hover:scale-110 transition duration-300">
                <AutoGraphIcon fontSize="large" />
              </div>
              <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Performance</span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Predictive Accuracy</h3>
              <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                Currently achieving high-fidelity performance metrics in initial testing phases across diverse symptom categories.
              </p>
              <div className="mt-4 text-xs font-mono text-red-300 bg-red-950/50 inline-block px-3 py-1 rounded-md border border-red-800">
                Avg. Precision: 94.8% / Recall: 92.1%
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded About Section */}
      <div className="border-t border-zinc-900 bg-black relative z-10">
        <AboutDirghaayu />
      </div>

    </div>
  );
};

export default HomePage;