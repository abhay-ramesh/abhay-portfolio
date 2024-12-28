"use client";

import { allPosts, Post } from "contentlayer/generated";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  language: string;
  forks_count: number;
  fork: boolean;
  homepage: string | null;
  og_image?: string;
}

interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: GitHubContributionWeek[];
        };
      };
    };
  };
}

interface AnimatedTextProps {
  texts: string[];
  className?: string;
}

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  tags: string[];
}

const AnimatedText = ({ texts, className = "" }: AnimatedTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [texts.length]);

  return (
    <div className={`relative h-[1.5em] overflow-hidden ${className}`}>
      {texts.map((text, i) => (
        <motion.div
          key={text}
          initial={{ y: "100%" }}
          animate={{ y: i === index ? "0%" : "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-full text-center"
        >
          {text}
        </motion.div>
      ))}
    </div>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const hoverScale = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300 },
  },
};

const textReveal = {
  initial: { y: "100%" },
  animate: { y: 0 },
};

const experiences = [
  {
    role: "Founder & CEO",
    company: "Hunchbite Technologies",
    period: "Present",
    description:
      "Web design and CRO agency helping companies grow through optimized websites and conversion strategies.",
  },
  {
    role: "Senior Frontend Engineer",
    company: "Kshana AI",
    period: "Apr 2024 - Present",
    description:
      "Working with Next.js and React.js to build modern web applications. Focusing on creating performant and responsive user interfaces.",
  },
  {
    role: "Frontend Web Developer (Intern)",
    company: "Kshana AI",
    period: "Feb 2024 - Apr 2024",
    description:
      "Developed web applications using React.js and Next.js. Gained hands-on experience in modern frontend development practices.",
  },
  {
    role: "Full Stack Web Developer (Intern)",
    company: "Instadukan",
    period: "Jun 2022 - Sep 2022",
    description:
      "Worked on full-stack web development projects in Bengaluru, Karnataka. Contributed to both frontend and backend development.",
  },
];

const skills = [
  { name: "Next.js", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "React", level: 88 },
  { name: "Node.js", level: 82 },
  { name: "TailwindCSS", level: 95 },
  { name: "AWS", level: 75 },
  { name: "Docker", level: 80 },
  { name: "PostgreSQL", level: 85 },
];

const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }}
      animate={{
        rotateX: isHovered ? position.y * -20 : 0,
        rotateY: isHovered ? position.x * 20 : 0,
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const GeometricPattern = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Small dots */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.25) 0.5px, transparent 0.5px)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "-8px -8px",
        }}
      />
      {/* Medium dots */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: "-24px -24px",
        }}
      />
      {/* Large dots */}
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)`,
          backgroundSize: "96px 96px",
          backgroundPosition: "-48px -48px",
        }}
      />
    </div>
  );
};

const ProjectCard = ({ repo }: { repo: GitHubRepo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ogImage, setOgImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOGImage = async () => {
      if (repo.homepage) {
        try {
          const response = await fetch(
            `/api/og?url=${encodeURIComponent(repo.homepage)}`
          );
          const data = await response.json();
          if (data.ogImage) {
            setOgImage(data.ogImage);
          } else {
            const response = await fetch(
              `/api/og?url=${encodeURIComponent(repo.html_url)}`
            );
            const data = await response.json();
            if (data.ogImage) {
              setOgImage(data.ogImage);
            }
          }
        } catch (error) {
          console.error("Error fetching OG image:", error);
        }
      }
    };

    fetchOGImage();
  }, [repo.homepage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-full group"
    >
      {/* Background and border effects */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-20"
        animate={{ opacity: isHovered ? 0.3 : 0.1 }}
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Animated border container */}
      <motion.div
        className="overflow-hidden absolute inset-0 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Border animations */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ x: "-100%" }}
          animate={
            isHovered
              ? {
                  x: ["100%", "-100%"],
                }
              : { x: "-100%" }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent"
          initial={{ y: "-100%" }}
          animate={
            isHovered
              ? {
                  y: ["100%", "-100%"],
                }
              : { y: "-100%" }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-white to-transparent"
          initial={{ x: "100%" }}
          animate={
            isHovered
              ? {
                  x: ["-100%", "100%"],
                }
              : { x: "100%" }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-t from-transparent via-white to-transparent"
          initial={{ y: "100%" }}
          animate={
            isHovered
              ? {
                  y: ["-100%", "100%"],
                }
              : { y: "100%" }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 1.5,
          }}
        />
      </motion.div>

      {/* Static border */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-white/10"
        animate={{
          borderColor: isHovered
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.1)",
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex relative flex-col p-4 h-full md:p-6">
        {repo.homepage && (
          <div className="overflow-hidden relative mb-4 rounded-lg aspect-[1200/630] group/preview">
            {ogImage ? (
              <>
                <div className="absolute top-0 right-0 left-0 p-4 bg-gradient-to-b to-transparent from-black/50">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-white/80">
                      Live
                    </span>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImage}
                  alt={`${repo.name} preview`}
                  //   width={600}
                  //   height={338}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover/preview:scale-105"
                />
                <div className="flex absolute inset-0 flex-col justify-center items-center opacity-0 transition-opacity duration-300 bg-black/80 group-hover/preview:opacity-100">
                  <div className="absolute top-0 right-0 left-0 p-4 bg-gradient-to-b to-transparent from-black/50">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-white/80">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-center p-6 text-center">
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/10"
                    >
                      <motion.svg
                        className="w-6 h-6 text-white transition-all duration-300 group-hover/preview:h-8 group-hover/preview:w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </motion.svg>
                    </a>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-white/90">
                        {repo.name}
                      </h4>
                      <p className="text-xs text-white/60 break-all max-w-[250px]">
                        {repo.homepage}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t to-transparent from-black/50" />
                </div>
              </>
            ) : (
              <>
                <div className="flex relative flex-col justify-center items-center w-full h-full bg-gradient-to-br to-transparent from-white/10 via-white/5">
                  <div className="absolute top-0 right-0 left-0 p-4 bg-gradient-to-b to-transparent from-black/50">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-white/80">
                        Live
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 items-center p-6 text-center">
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/10"
                    >
                      <motion.svg
                        className="w-6 h-6 text-white transition-all duration-300 group-hover/preview:h-8 group-hover/preview:w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </motion.svg>
                    </a>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-white/90">
                        {repo.name}
                      </h4>
                      <p className="text-xs text-white/60 break-all max-w-[250px]">
                        {repo.homepage}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t to-transparent from-black/50" />
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col flex-grow">
          <div className="flex flex-col justify-between items-start mb-3 md:mb-4 md:flex-row md:items-center">
            <h3 className="mb-2 text-lg font-bold md:text-2xl font-clash md:mb-0">
              {repo.name}
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white/60">{repo.stargazers_count}</span>
              </div>
              {repo.language && (
                <span className="px-2 py-1 text-xs whitespace-nowrap rounded md:text-sm bg-white/10">
                  {repo.language}
                </span>
              )}
            </div>
          </div>

          <p className="mb-3 text-sm md:text-base text-white/60 line-clamp-2 md:mb-4">
            {repo.description}
          </p>

          <div className="flex flex-col gap-2 mt-auto sm:flex-row sm:gap-4">
            <motion.a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded transition-all bg-white/10 hover:bg-white hover:text-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Code
            </motion.a>
            {repo.homepage && (
              <motion.a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded transition-all bg-white/10 hover:bg-white hover:text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SkillBar = ({
  skill,
  index,
}: {
  skill: (typeof skills)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <motion.div
        className="absolute -inset-4 rounded-lg bg-white/5"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
      />
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className="font-medium font-clash">{skill.name}</span>
          <span className="text-white/60">{skill.level}%</span>
        </div>
        <div className="overflow-hidden h-1 rounded-full bg-white/10">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            viewport={{ once: true }}
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface BaseFormInputProps {
  label: string;
}

interface TextInputProps extends BaseFormInputProps {
  type?: "text" | "email" | "password";
  textarea?: false;
}

interface TextareaProps extends BaseFormInputProps {
  textarea: true;
  type?: never;
}

type FormInputProps =
  | (TextInputProps & React.InputHTMLAttributes<HTMLInputElement>)
  | (TextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>);

const FormInput = ({
  label,
  textarea,
  type = "text",
  ...props
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const Component = textarea ? "textarea" : "input";

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIsFocused(!!e.target.value);
  };

  if (textarea) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative"
      >
        <motion.label
          className={`absolute left-4 transition-all duration-200 ${
            isFocused
              ? "-top-2 text-xs bg-[#0A0A0A] px-2"
              : "top-3 text-white/60"
          }`}
          animate={{ y: isFocused ? 0 : 0 }}
        >
          {label}
        </motion.label>
        <textarea
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="px-4 py-3 w-full text-white bg-transparent rounded-lg border transition-colors outline-none border-white/10 focus:border-white/30"
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative"
    >
      <motion.label
        className={`absolute left-4 transition-all duration-200 ${
          isFocused ? "-top-2 text-xs bg-[#0A0A0A] px-2" : "top-3 text-white/60"
        }`}
        animate={{ y: isFocused ? 0 : 0 }}
      >
        {label}
      </motion.label>
      <input
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="px-4 py-3 w-full text-white bg-transparent rounded-lg border transition-colors outline-none border-white/10 focus:border-white/30"
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    </motion.div>
  );
};

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sections = [
    "home",
    "about",
    "experience",
    "projects",
    "blog",
    "contact",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibility = 0;
        let mostVisibleSection = activeSection;

        entries.forEach((entry) => {
          const visibilityRatio = entry.intersectionRatio;
          if (visibilityRatio > maxVisibility) {
            maxVisibility = visibilityRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (maxVisibility > 0.2) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="hidden fixed top-0 bottom-0 right-8 z-50 items-center pointer-events-none md:flex"
      >
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <motion.button
              key={section}
              onClick={() => scrollToSection(section)}
              onMouseEnter={() => setHoveredSection(section)}
              onMouseLeave={() => setHoveredSection(null)}
              className="flex relative justify-end items-center pr-2 h-8 pointer-events-auto group"
              whileHover={{ x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={`absolute right-8 text-sm capitalize transition-all duration-200 ${
                  hoveredSection === section
                    ? "opacity-100 text-white translate-x-0"
                    : "opacity-0 text-white/60 translate-x-2"
                }`}
              >
                {section}
              </span>
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  activeSection === section
                    ? "bg-white scale-125"
                    : "bg-white/20 group-hover:bg-white/60"
                }`}
              />
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute right-6 bottom-6 p-3 rounded-full backdrop-blur-sm bg-white/10"
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </motion.button>

        {/* Mobile Menu */}
        <motion.div
          className="absolute right-6 bottom-24 p-2 rounded-lg backdrop-blur-sm bg-black/80"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            y: isMobileMenuOpen ? 0 : 20,
            scale: isMobileMenuOpen ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}
        >
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/10"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

const LoadingAnimation = () => {
  const [shouldRemove, setShouldRemove] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldRemove(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (shouldRemove) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: 3,
        times: [0, 0.8, 1],
        ease: "easeInOut",
      }}
      onAnimationComplete={() => setShouldRemove(true)}
    >
      <motion.div
        className="relative w-24 h-24"
        initial={{ opacity: 1, scale: 0.8 }}
        animate={{
          opacity: [1, 1, 0],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          times: [0, 0.8, 1],
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-white/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white border-r-transparent border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const checkPointer = () => {
      const element = document.elementFromPoint(
        parseInt(cursor.style.transform.split("(")[1]),
        parseInt(cursor.style.transform.split(",")[1])
      );
      setIsPointer(
        window.getComputedStyle(element || document.body).cursor === "pointer"
      );
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousemove", checkPointer);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousemove", checkPointer);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-50 w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <motion.div
          className="absolute inset-0 bg-white rounded-full mix-blend-difference"
          animate={{
            scale: isPointer ? 1.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <style jsx global>{`
        body {
          cursor: none !important;
        }
        a,
        button,
        input,
        textarea,
        [role="button"] {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          body,
          a,
          button,
          input,
          textarea,
          [role="button"] {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <motion.div
        className="absolute -inset-40 opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
          y: y1,
        }}
      />
      <motion.div
        className="absolute -inset-40 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)",
          y: y2,
        }}
      />
    </div>
  );
};

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isInView, setIsInView] = useState(false);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const scrambleSpeed = 40; // ms between scrambles
  const revealDelay = 100; // ms between each letter reveal

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const finalText = text.split("");
    let scrambleTimer: NodeJS.Timeout;
    let revealTimer: NodeJS.Timeout;

    // Initialize with scrambled text
    setDisplayText(
      finalText
        .map((char) =>
          char === " "
            ? " "
            : characters[Math.floor(Math.random() * characters.length)]
        )
        .join("")
    );

    // Function to scramble remaining letters
    const scrambleRemaining = () => {
      const newText = finalText
        .map((char, index) => {
          if (index < currentIndex || char === " ") return char;
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join("");
      setDisplayText(newText);
    };

    // Start scrambling
    scrambleTimer = setInterval(scrambleRemaining, scrambleSpeed);

    // Reveal one letter at a time
    const revealNext = () => {
      if (currentIndex < finalText.length) {
        currentIndex++;
        revealTimer = setTimeout(revealNext, revealDelay);
      } else {
        clearInterval(scrambleTimer);
      }
    };

    // Start revealing after a short delay
    revealTimer = setTimeout(revealNext, revealDelay);

    return () => {
      clearInterval(scrambleTimer);
      clearTimeout(revealTimer);
    };
  }, [text, isInView]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => setIsInView(true)}
      className="flex relative items-center mb-8 md:mb-16"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-1 h-12 bg-white origin-left md:w-2 md:h-16"
      />
      <div className="relative">
        <h2 className="pl-4 text-4xl font-bold tracking-tighter md:text-7xl font-clash">
          {displayText}
        </h2>
        <motion.div
          className="absolute bottom-0 left-4 right-0 h-[2px] bg-gradient-to-r from-white/80 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
};

const MagneticButton = ({
  children,
  className = "",
  strength = 30,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      buttonRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };
    const x = (clientX - (left + width / 2)) / strength;
    const y = (clientY - (top + height / 2)) / strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};

const SocialLinks = () => {
  const links = [
    {
      href: "https://github.com/abhay-ramesh",
      label: "GITHUB",
      icon: "github",
    },
    {
      href: "https://www.linkedin.com/in/abhay-ramesh/",
      label: "LINKEDIN",
      icon: "linkedin",
    },
    {
      href: "https://www.abhayramesh.com",
      label: "PORTFOLIO",
      icon: "external-link",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex gap-8 mt-8"
    >
      {links.map((link) => (
        <MagneticButton
          key={link.label}
          onClick={() => window.open(link.href, "_blank")}
          className="text-sm tracking-[0.3em] text-white/60 transition-colors font-medium flex items-center gap-2 hover:text-white"
        >
          {link.label}
        </MagneticButton>
      ))}
    </motion.div>
  );
};

const BlogCard = ({ post }: { post: Post }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative h-full group"
      >
        <motion.div
          className="absolute inset-0 rounded-lg opacity-20"
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
          }}
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        {/* Animated border container */}
        <motion.div
          className="overflow-hidden absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Border animations */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: "-100%" }}
            animate={
              isHovered
                ? {
                    x: ["100%", "-100%"],
                  }
                : { x: "-100%" }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent"
            initial={{ y: "-100%" }}
            animate={
              isHovered
                ? {
                    y: ["100%", "-100%"],
                  }
                : { y: "-100%" }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-white to-transparent"
            initial={{ x: "100%" }}
            animate={
              isHovered
                ? {
                    x: ["-100%", "100%"],
                  }
                : { x: "100%" }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-t from-transparent via-white to-transparent"
            initial={{ y: "100%" }}
            animate={
              isHovered
                ? {
                    y: ["-100%", "100%"],
                  }
                : { y: "100%" }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1.5,
            }}
          />
        </motion.div>

        {/* Static border */}
        <motion.div
          className="absolute inset-0 rounded-lg border border-white/10"
          animate={{
            borderColor: isHovered
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.1)",
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="flex relative flex-col p-4 h-full md:p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs whitespace-nowrap rounded md:text-sm bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col flex-grow">
            <h3 className="mb-3 text-xl font-bold transition-colors md:text-2xl font-clash md:mb-4 group-hover:text-white text-white/90">
              {post.title}
            </h3>

            <p className="flex-grow mb-4 text-sm md:text-base text-white/60 line-clamp-2 md:mb-6">
              {post.excerpt}
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs md:text-sm text-white/40">
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>{post.readTime} read</span>
              </div>

              <motion.div
                className="flex gap-2 items-center text-sm font-medium transition-colors text-white/60 group-hover:text-white"
                animate={{ x: isHovered ? 4 : 0 }}
              >
                <span>Read Now</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const blogPosts = allPosts.sort(
  (a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function PortfolioV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinnedRepos, setPinnedRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Fetch top starred repos
    fetch(
      "https://api.github.com/users/abhay-ramesh/repos?sort=stars&per_page=6",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const sortedRepos = data
          .filter((repo: GitHubRepo) => !repo.fork)
          .sort(
            (a: GitHubRepo, b: GitHubRepo) =>
              b.stargazers_count - a.stargazers_count
          )
          .slice(0, 4);
        setPinnedRepos(sortedRepos);
      })
      .catch(console.error);

    // Fetch contribution data using GitHub GraphQL API
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
          user(login: "abhay-ramesh") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((data: GitHubGraphQLResponse) => {
        console.log("GitHub API Response:", data); // Debug log
        const calendar =
          data.data.user.contributionsCollection.contributionCalendar;
        const contributions = calendar.weeks.flatMap(
          (week: GitHubContributionWeek) =>
            week.contributionDays.map((day: GitHubContributionDay) => ({
              date: day.date,
              count: day.contributionCount,
              level: getContributionLevel(day.contributionCount),
            }))
        );
        console.log("Processed Contributions:", contributions); // Debug log
        setContributions(contributions);
      })
      .catch(console.error);
  }, []);

  // Helper function to determine contribution level
  const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const getContributionColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-white/5";
      case 1:
        return "bg-white/20";
      case 2:
        return "bg-white/40";
      case 3:
        return "bg-white/60";
      case 4:
        return "bg-white/80";
      default:
        return "bg-white/5";
    }
  };

  return (
    <>
      <LoadingAnimation />
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 2.5 }}
        className="relative min-h-screen text-white bg-[#0A0A0A] font-satoshi"
      >
        <GeometricPattern />
        <Navigation />

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 right-0 left-0 z-[60] h-1 bg-white transform origin-left"
          style={{ scaleX }}
        />

        <div className="relative">
          {/* Hero Section - Full width for impact */}
          <section
            id="home"
            className="flex overflow-hidden relative flex-col justify-center items-center px-4 min-h-screen border-b md:px-16 border-white/10"
          >
            {/* Animated Background */}
            {/* <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            /> */}

            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8 md:mb-12 group"
            >
              <motion.div
                className="absolute -inset-0.5 bg-white opacity-20 rounded-full blur-sm group-hover:opacity-30 transition-opacity"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-32 h-32 md:w-48 md:h-48">
                <Image
                  src="https://github.com/abhay-ramesh.png"
                  alt="Abhay Ramesh"
                  fill
                  className="object-cover rounded-full transition-all duration-500 hover:grayscale-0"
                  priority
                />
              </div>
            </motion.div>

            {/* Name */}
            <div className="overflow-hidden mb-4 md:mb-6">
              <motion.h1
                className="relative text-4xl font-bold tracking-tighter text-center md:text-8xl font-clash"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="relative">
                  ABHAY RAMESH
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </motion.h1>
            </div>

            {/* Animated role text */}
            <AnimatedText
              texts={[
                "FULL-STACK DEVELOPER",
                "UI/UX DESIGNER",
                "OPEN SOURCE CONTRIBUTOR",
              ]}
              className="mb-6 text-lg font-light tracking-widest text-center uppercase md:mb-8 md:text-2xl text-white/80"
            />

            {/* Enhanced social links */}
            <SocialLinks />

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex justify-center w-5 h-8 rounded-full border-2 border-white/20">
                <motion.div
                  className="mt-2 w-1 h-2 rounded-full bg-white/20"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </section>

          {/* Content Container for better readability */}
          <div className="mx-auto max-w-6xl">
            {/* About Section */}
            <section
              id="about"
              className="flex justify-center items-center px-4 py-16 min-h-screen border-b md:px-8 md:py-32 border-white/10"
            >
              <div className="max-w-4xl">
                <ScrambleText text="ABOUT" />
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24"
                >
                  <div className="space-y-6 md:space-y-8">
                    <motion.p
                      variants={fadeInUp}
                      className="text-lg leading-relaxed md:text-xl text-white/80"
                    >
                      I craft digital experiences with clean code and bold
                      design. Specializing in modern web technologies, I build
                      scalable applications that make an impact.
                    </motion.p>
                    <motion.p
                      variants={fadeInUp}
                      className="text-lg leading-relaxed md:text-xl text-white/80"
                    >
                      My approach combines technical excellence with
                      minimalistic design principles.
                    </motion.p>
                  </div>
                  <div>
                    <motion.div
                      variants={fadeInUp}
                      className="space-y-8 md:space-y-12"
                    >
                      <div>
                        <h3 className="mb-6 text-xl font-bold tracking-wide md:mb-8 md:text-2xl font-clash">
                          SKILLS
                        </h3>
                        <motion.div
                          className="grid grid-cols-1 gap-4 md:gap-6"
                          variants={staggerContainer}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true }}
                        >
                          {skills.map((skill, index) => (
                            <SkillBar
                              key={skill.name}
                              skill={skill}
                              index={index}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Experience Section */}
            <section
              id="experience"
              className="px-4 py-16 min-h-screen border-b md:px-8 md:py-32 border-white/10"
            >
              <ScrambleText text="EXPERIENCE" />
              <div className="space-y-12 md:space-y-16">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex flex-col justify-between items-start mb-4 md:flex-row md:items-baseline">
                      <h3 className="mb-2 text-2xl font-bold md:text-3xl font-clash md:mb-0">
                        {exp.role}
                      </h3>
                      <span className="text-white/60">{exp.period}</span>
                    </div>
                    <p className="text-lg md:text-xl text-white/80">
                      {exp.company}
                    </p>
                    <p className="mt-4 text-sm md:text-base text-white/60">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Projects Section */}
            <section
              id="projects"
              className="px-4 py-16 min-h-screen border-b md:px-8 md:py-32 border-white/10"
            >
              <ScrambleText text="PROJECTS" />

              {/* GitHub Contributions Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="overflow-x-auto mx-auto mb-12 w-full md:mb-16"
              >
                <div className="flex flex-col justify-between items-start mb-6 md:flex-row md:items-baseline md:mb-8">
                  <h3 className="mb-2 text-xl font-bold md:text-2xl font-clash md:mb-0">
                    GITHUB ACTIVITY
                  </h3>
                  {contributions.length > 0 && (
                    <span className="text-sm md:text-base text-white/60">
                      {contributions.reduce((acc, curr) => acc + curr.count, 0)}{" "}
                      contributions in the last year
                    </span>
                  )}
                </div>

                <div className="min-w-[750px] md:min-w-0">
                  <div className="flex">
                    {/* Days of week labels */}
                    <div
                      className="flex flex-col text-right justify-between mr-2 text-[10px] text-white/40"
                      style={{
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Contribution grid */}
                    <div className="flex-1">
                      <div
                        className="grid grid-rows-7 auto-rows-[17px] gap-[3px]"
                        style={{
                          gridTemplateColumns: `repeat(${Math.ceil(
                            contributions.length / 7
                          )}, 17px)`,
                        }}
                      >
                        {Array.from({
                          length: Math.ceil(contributions.length / 7),
                        }).map((_, colIndex) =>
                          Array.from({ length: 7 }).map((_, rowIndex) => {
                            const contributionIndex = colIndex * 7 + rowIndex;
                            const contribution = contributions[
                              contributionIndex
                            ] || {
                              count: 0,
                              level: 0,
                              date: new Date().toISOString(),
                            };

                            // Skip future dates
                            const contributionDate = new Date(
                              contribution.date
                            );
                            const today = new Date();
                            if (contributionDate > today) {
                              return null;
                            }

                            const isToday =
                              contributionDate.toDateString() ===
                                today.toDateString() &&
                              contributionIndex < contributions.length;

                            return (
                              <div
                                key={`${colIndex}-${rowIndex}`}
                                className="relative group"
                                style={{
                                  gridColumn: colIndex + 1,
                                  gridRow: rowIndex + 1,
                                }}
                              >
                                <div
                                  className={`w-[15px] h-[15px] rounded-sm ${getContributionColor(
                                    contribution.level
                                  )} ${
                                    isToday
                                      ? "ring-2 ring-white ring-offset-1 ring-offset-[#0A0A0A]"
                                      : ""
                                  }`}
                                  title={`${
                                    contribution.count
                                  } contributions on ${contributionDate.toLocaleDateString()}`}
                                />
                                <div className="absolute bottom-full left-1/2 z-10 px-2 py-1 mb-2 text-xs whitespace-nowrap rounded opacity-0 transition-opacity -translate-x-1/2 bg-white/10 group-hover:opacity-100">
                                  {contribution.count} contributions on{" "}
                                  {contributionDate.toLocaleDateString()}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-2 items-center mt-4 text-sm text-white/60">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${getContributionColor(
                          level
                        )}`}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </motion.div>

              {/* GitHub Repositories */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
                {pinnedRepos.map((repo) => (
                  <ProjectCard key={repo.name} repo={repo} />
                ))}
              </div>
            </section>

            {/* Blog Section */}
            <section
              id="blog"
              className="px-4 py-16 min-h-screen border-b md:px-8 md:py-32 border-white/10"
            >
              <ScrambleText text="BLOG" />
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-8 text-lg leading-relaxed md:mb-12 md:text-xl text-white/80"
              >
                Thoughts, learnings, and insights about web development and
                design.
              </motion.p>

              <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                {blogPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section
              id="contact"
              className="flex justify-center items-center px-4 py-16 min-h-screen md:px-8 md:py-32"
            >
              <div className="w-full max-w-4xl text-center">
                <ScrambleText text="LETS CONNECT" />
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mb-8 text-lg md:mb-12 md:text-xl text-white/80"
                >
                  Open to new opportunities and collaborations.
                </motion.p>

                <form className="mx-auto mt-8 space-y-4 max-w-xl md:mt-12 md:space-y-6">
                  <FormInput label="Name" name="name" required />
                  <FormInput label="Email" type="email" name="email" required />
                  <FormInput
                    label="Message"
                    textarea
                    name="message"
                    rows={4}
                    required
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-3 w-full font-medium text-black bg-white rounded-lg transition-colors md:py-4 hover:bg-white/90"
                  >
                    Send Message
                  </motion.button>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-4 justify-center mt-12 md:flex-row md:gap-8 md:mt-16"
                >
                  <motion.a
                    whileHover={{ y: -2 }}
                    href="https://www.linkedin.com/in/abhay-ramesh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg tracking-[0.3em] text-white/60 hover:text-white transition-colors font-medium"
                  >
                    LINKEDIN
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -2 }}
                    href="mailto:contact@abhayramesh.com"
                    className="text-base md:text-lg tracking-[0.3em] text-white/60 hover:text-white transition-colors font-medium"
                  >
                    EMAIL
                  </motion.a>
                </motion.div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </>
  );
}
