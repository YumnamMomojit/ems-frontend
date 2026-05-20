import { motion } from "framer-motion";

export function WelcomeBanner({ userName }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-darkRed
       p-6 md:p-8 shadow-sm"
      data-testid="welcome-banner">
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none">
          <circle cx="350" cy="100" r="120" fill="white" />
          <circle cx="380" cy="50" r="80" fill="white" />
          <circle cx="300" cy="150" r="60" fill="white" />
        </svg>
      </div>

      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl md:text-3xl font-semibold text-white"
          data-testid="text-greeting">
          {getGreeting()}, {userName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-white/80 text-sm md:text-base"
          data-testid="text-date">
          {getDate()}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-1 text-white/60 text-sm">
          Ready to make today productive?
        </motion.p>
      </div>
    </motion.div>
  );
}
