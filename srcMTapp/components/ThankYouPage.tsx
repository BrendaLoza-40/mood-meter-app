import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

interface ThankYouPageProps {
  selectedEmotion: string;
  onReset: () => void;
}

export function ThankYouPage({ selectedEmotion, onReset }: ThankYouPageProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  return (
    <div className={`min-h-screen ${colors.background} flex items-center justify-center p-6 transition-all duration-500 relative overflow-hidden`}>
      {/* Decorative geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-right: Large rounded square (semi-transparent, partially off-screen) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.15,
            y: [0, -8, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.2 },
            y: { 
              duration: 4000 / 1000,
              repeat: Infinity,
              ease: [0.37, 0, 0.63, 1], // Ease In-Out Sine
            }
          }}
          className={`absolute -top-48 -right-48 w-[500px] h-[500px] bg-gradient-to-bl ${colors.gradient} rounded-[80px] blur-2xl`}
        />
        
        {/* Top-right: Rounded square accent with softer edges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.18,
            x: [0, 3, 0],
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.4 },
            x: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-16 right-12 w-[180px] h-[180px] bg-gradient-to-bl ${colors.gradient} rounded-[40px] blur-xl opacity-20`}
        />

        {/* Bottom-left: Echo of welcome page blob */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.18,
            x: [0, -3, 0],
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.6 },
            x: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 4000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute -bottom-32 -left-32"
          width="400"
          height="400"
          viewBox="0 0 400 400"
        >
          <defs>
            <linearGradient id="blobGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(74, 222, 128, 0.3)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(96, 165, 250, 0.3)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 250 80 Q 320 150 320 250 Q 300 350 200 370 Q 100 350 70 250 Q 80 150 150 80 Q 200 60 250 80 Z"
            fill="url(#blobGrad2)"
            style={{ filter: 'blur(40px)' }}
          />
        </motion.svg>

        {/* Bottom-left: Circle accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            x: [0, -2, 0],
            y: [0, 2, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.8 },
            x: { duration: 3200 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-tr ${colors.gradient} rounded-full blur-xl`}
        />

        {/* Small decorative dots - top left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.25,
            y: [0, -2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1 },
            y: { duration: 2500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-32 left-24 w-4 h-4 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            y: [0, 2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1.2 },
            y: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-48 left-16 w-3 h-3 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />

        {/* Small decorative dots - bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.25,
            x: [0, 2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1.4 },
            x: { duration: 2800 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-40 right-20 w-4 h-4 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            x: [0, -2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1.6 },
            x: { duration: 3200 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-56 right-32 w-3 h-3 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />

        {/* Geometric outline accent - right side */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.15,
            y: [0, -3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 1.8 },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute top-1/2 right-8 -translate-y-1/2"
          width="60"
          height="60"
          viewBox="0 0 60 60"
        >
          <circle
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-gradient-to-br ${colors.gradient}`}
            style={{ filter: 'blur(1px)', opacity: 0.4 }}
          />
        </motion.svg>
      </div>
      
      <ThemeToggle />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-6`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className={`w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full mx-auto flex items-center justify-center shadow-xl`}>
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className={colors.text}>Thank You!</h1>
            <p className={`${colors.text} opacity-70 mt-2`}>
              You've successfully logged your mood
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`${colors.accent} rounded-2xl p-6 inline-block`}
          >
            <p className={colors.text}>
              <span className="opacity-60">You're feeling: </span>
              <span>{selectedEmotion}</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${colors.accent} rounded-2xl p-8 space-y-4`}
          >
            <h2 className={colors.text}>FLC Wellness Center</h2>
            
            <div className={`${colors.text} space-y-4 opacity-90`}>
              <p>
                We're here to support your mental health and well-being.
              </p>
              
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center justify-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>(555) 123-4567</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>wellness@flc.edu</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Mon-Fri, 8am-5pm</span>
                </motion.div>
              </div>

              <p className="pt-4 opacity-80">
                Our counselors are available for individual sessions, group therapy, and crisis support.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-4 space-y-4"
          >
            <p className={`${colors.text} opacity-60`}>Need to talk to someone?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={onReset}
                className={`px-6 py-3 ${colors.cardBg} ${colors.text} rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border-2 ${colors.text.replace('text-', 'border-')}`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home Screen
              </motion.button>
              <motion.button
                onClick={() => window.open('tel:555-123-4567', '_self')}
                className={`px-6 py-3 bg-gradient-to-br ${colors.gradient} text-white rounded-full transition-all duration-300 shadow-lg`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Wellness Center
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
