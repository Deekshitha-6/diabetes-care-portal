import { motion } from "motion/react";
import { HeartPulse } from "lucide-react";
import heroImg from "../assets/images/glycoslim_welcome_1780040747142.png";
function WelcomeScreen({ onStart }) {
  return <div className="min-h-screen flex items-center justify-center bg-[#f8f9f4] px-4 py-12" id="welcome-container">
      <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-2xl bg-white border border-[#8fb394]/20 rounded-3xl p-8 md:p-12 shadow-sm text-center"
    id="welcome-card"
  >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8fb394]/20 text-[#2d362e] rounded-2xl mb-6">
          <HeartPulse className="w-8 h-8" />
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[#1a1f1a] mb-3" id="welcome-title">
          Dia-Assisst
        </h1>
        
        <p className="text-[#5c6e5e] font-sans text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Your comprehensive clinical suite for diabetes management, obesity monitoring, real-time food nutritional color coding, and automated dosage hazard checking.
        </p>

        {
    /* Custom Hand-Crafted Hero Image Asset */
  }
        <div className="mb-10 rounded-2xl overflow-hidden border border-[#8fb394]/20 shadow-md">
          <img
    src={heroImg}
    alt="Glycoslim App Overview"
    referrerPolicy="no-referrer"
    className="w-full h-auto object-cover max-h-[280px]"
    id="welcome-hero-photo"
  />
        </div>

        <button
    onClick={onStart}
    id="btn-get-started"
    className="px-8 py-3.5 bg-[#2d362e] hover:bg-[#3e4a3f] text-white rounded-xl font-sans font-medium text-sm transition-all duration-200 outline-none cursor-pointer shadow-sm hover:shadow-md"
  >
          Access Portal
        </button>
      </motion.div>
    </div>;
}
export {
  WelcomeScreen as default
};
