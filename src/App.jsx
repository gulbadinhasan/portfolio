import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cloud, Server, Shield, GitBranch, Activity, ExternalLink, Mail, GitHub, LinkedinIcon } from 'lucide-react';

// --- Reusable Components ---

const SectionHeading = ({ children }) => (
  <motion.h2 
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className="text-3xl font-bold mb-12 flex items-center gap-4"
  >
    {children}
    <div className="h-px flex-grow bg-gradient-to-r from-neon-cyan to-transparent"></div>
  </motion.h2>
);

const SkillCard = ({ icon: Icon, name, level }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0, 242, 255, 0.4)" }}
    className="p-6 bg-dark-card border border-white/10 rounded-xl flex items-center gap-4 transition-colors hover:border-neon-cyan cursor-crosshair"
  >
    <Icon className="text-neon-cyan w-8 h-8" />
    <div className="w-full">
      <h3 className="text-white font-mono text-sm mb-2">{name}</h3>
      <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="h-full bg-neon-cyan shadow-[0_0_10px_#00f2ff]"
        />
      </div>
    </div>
  </motion.div>
);

// --- Main Application ---

function App() {
  const skills = [
    { name: "Kubernetes / Docker", icon: Server, level: 95 },
    { name: "AWS / Cloud Architecture", icon: Cloud, level: 90 },
    { name: "Terraform / IaC", icon: Terminal, level: 85 },
    { name: "CI/CD (GitHub Actions, Jenkins)", icon: GitBranch, level: 95 },
    { name: "Observability (Datadog, Prometheus)", icon: Activity, level: 80 },
    { name: "DevSecOps", icon: Shield, level: 85 },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-neon-cyan selection:text-black">
      
      {/* HERO SECTION */}
      <header className="min-h-screen flex flex-col justify-center items-center text-center p-6 border-b border-white/5 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-gray-400 mb-4 tracking-widest text-sm">
            &gt; INITIALIZING LEAD_DEV_OPS.EXE <span className="animate-pulse text-neon-cyan">_</span>
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 uppercase bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Your Name
          </h1>
          <p className="text-xl text-gray-400 font-mono max-w-2xl mx-auto">
            Architecting Scalable Cloud Ecosystems & Automating The Future.
          </p>
        </motion.div>
      </header>

      {/* SKILLS SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <SectionHeading>Technical Arsenal</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <SkillCard key={i} {...skill} />
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto bg-white/[0.02] border-y border-white/5">
        <SectionHeading>Infrastructure Wins</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-cyan transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Auto-Scaling Hybrid Cloud <ExternalLink className="w-5 h-5 text-neon-cyan cursor-pointer" />
            </h3>
            <p className="text-gray-400 mb-6">Built a custom Terraform provider to manage hybrid-cloud resources across AWS and on-premise data centers, enabling seamless workload shifting.</p>
            <div className="pt-4 border-t border-white/10 text-emerald-400 font-mono text-sm">
              ⚡ Result: 30% reduction in annual cloud spend.
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-cyan transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Zero-Trust CI/CD <ExternalLink className="w-5 h-5 text-neon-cyan cursor-pointer" />
            </h3>
            <p className="text-gray-400 mb-6">Hardened enterprise deployment pipelines with HashiCorp Vault integration and automated security scanning (SAST/DAST/Container).</p>
            <div className="pt-4 border-t border-white/10 text-emerald-400 font-mono text-sm">
              ⚡ Result: Zero security breaches over 24 months.
            </div>
          </motion.div>

        </div>
      </section>

      {/* CONTACT FOOTER */}
      <footer className="py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Establish Connection</h2>
          <p className="text-gray-400 mb-10">Looking for a lead architect to stabilize your scale? My inbox is always open for technically challenging opportunities.</p>
          
          <a href="mailto:your.email@example.com" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-neon-cyan text-neon-cyan font-bold uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_#00f2ff]">
            <Mail className="w-5 h-5" /> Execute Ping
          </a>

          <div className="mt-16 flex justify-center gap-6">
            <a href="#" className="text-gray-500 hover:text-neon-cyan transition-colors"><Github className="w-6 h-6" /></a>
            <a href="#" className="text-gray-500 hover:text-neon-cyan transition-colors"><Linkedin className="w-6 h-6" /></a>
          </div>
        </motion.div>
      </footer>

    </div>
  );
}

export default App;