"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
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
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2022 - Present",
    description:
      "Building modern web applications with Next.js, React, and TypeScript. Specializing in creating performant and scalable solutions.",
  },
  {
    role: "Web Developer",
    company: "Open Source",
    period: "2021 - Present",
    description:
      "Contributing to various open-source projects, focusing on web development tools and libraries.",
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
    <div className="overflow-hidden fixed inset-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "-19px -19px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "160px 160px",
          backgroundPosition: "-79px -79px",
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
      className="relative group"
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

      <div className="relative p-6">
        {ogImage && (
          <div className="overflow-hidden mb-6 rounded-lg aspect-video">
            <img
              src={ogImage}
              alt={`${repo.name} preview`}
              width={600}
              height={338}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold font-clash">{repo.name}</h3>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
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
              <span className="px-2 py-1 text-sm rounded bg-white/10">
                {repo.language}
              </span>
            )}
          </div>
        </div>

        <p className="mb-6 text-white/60 line-clamp-2">{repo.description}</p>

        <motion.div
          className="flex gap-4 mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white rounded transition-all bg-white/10 hover:bg-white hover:text-black"
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
              className="px-4 py-2 text-sm font-medium text-white rounded transition-all bg-white/10 hover:bg-white hover:text-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Live Demo
            </motion.a>
          )}
        </motion.div>
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
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="flex fixed top-0 bottom-0 right-8 z-50 items-center pointer-events-none"
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
    <div className="overflow-hidden fixed inset-0 pointer-events-none">
      <motion.div
        className="absolute -inset-40 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
          y: y1,
        }}
      />
      <motion.div
        className="absolute -inset-40 opacity-20"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 60%)",
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
      className="flex relative items-center mb-16"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-2 h-16 bg-white origin-left"
      />
      <h2 className="pl-4 text-7xl font-bold tracking-tighter font-clash">
        {displayText}
      </h2>
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

const BlogCard = ({ post }: { post: BlogPost }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
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
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-lg border border-white/10"
        animate={{
          borderColor: isHovered
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.1)",
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-6">
        <div className="flex gap-4 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-sm rounded bg-white/10">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mb-4 text-2xl font-bold font-clash">{post.title}</h3>
        <p className="mb-6 text-white/60 line-clamp-2">{post.excerpt}</p>

        <div className="flex justify-between items-center mt-auto text-sm text-white/40">
          <span>{post.date}</span>
          <span>{post.readTime} read</span>
        </div>

        <motion.div
          className="flex absolute inset-0 justify-center items-center rounded-lg opacity-0 bg-black/80"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.button
            className="px-6 py-3 text-sm font-medium text-black bg-white rounded-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: isHovered ? 1 : 0.9 }}
          >
            Read More
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const sampleBlogPosts: BlogPost[] = [
  {
    title: "Building a Modern Portfolio with Next.js and Framer Motion",
    excerpt:
      "A deep dive into creating smooth animations and transitions in React applications using Framer Motion.",
    date: "Dec 15, 2023",
    readTime: "5 min",
    slug: "modern-portfolio-nextjs",
    tags: ["Next.js", "React", "Animation"],
  },
  {
    title: "The Power of Server Components in Next.js 13",
    excerpt:
      "Exploring the benefits and implementation details of Server Components in Next.js applications.",
    date: "Dec 10, 2023",
    readTime: "4 min",
    slug: "server-components-nextjs",
    tags: ["Next.js", "Performance", "React"],
  },
  {
    title: "Mastering TypeScript: Advanced Patterns and Best Practices",
    excerpt:
      "Learn advanced TypeScript patterns and techniques to write more maintainable code.",
    date: "Dec 5, 2023",
    readTime: "6 min",
    slug: "typescript-advanced-patterns",
    tags: ["TypeScript", "JavaScript", "Development"],
  },
  {
    title: "Creating Custom Hooks in React: A Practical Guide",
    excerpt:
      "A comprehensive guide to creating and using custom hooks in React applications.",
    date: "Nov 30, 2023",
    readTime: "4 min",
    slug: "react-custom-hooks",
    tags: ["React", "Hooks", "JavaScript"],
  },
];

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
        <ParallaxBackground />
        <Navigation />

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 right-0 left-0 z-[60] h-1 bg-white transform origin-left"
          style={{ scaleX }}
        />

        <div className="relative">
          {/* Hero Section */}
          <section
            id="home"
            className="flex overflow-hidden relative flex-col justify-center items-center px-16 min-h-screen border-b border-white/10"
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

            {/* Profile Image with enhanced animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-12 group"
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
              <div className="relative w-48 h-48">
                <Image
                  src="https://github.com/abhay-ramesh.png"
                  alt="Abhay Ramesh"
                  fill
                  className="object-cover rounded-full grayscale transition-all duration-500 hover:grayscale-0"
                  priority
                />
              </div>
            </motion.div>

            {/* Name with enhanced animation */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                className="text-8xl font-bold tracking-tighter font-clash"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                ABHAY RAMESH
              </motion.h1>
            </div>

            {/* Animated role text */}
            <AnimatedText
              texts={[
                "FULL-STACK DEVELOPER",
                "UI/UX DESIGNER",
                "OPEN SOURCE CONTRIBUTOR",
              ]}
              className="mb-8 text-2xl font-light tracking-widest uppercase text-white/80"
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

          {/* About Section */}
          <section
            id="about"
            className="flex justify-center items-center px-16 min-h-screen border-b border-white/10"
          >
            <div className="max-w-4xl">
              <ScrambleText text="ABOUT" />
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-24"
              >
                <div className="space-y-8">
                  <motion.p
                    variants={fadeInUp}
                    className="text-xl leading-relaxed text-white/80"
                  >
                    I craft digital experiences with clean code and bold design.
                    Specializing in modern web technologies, I build scalable
                    applications that make an impact.
                  </motion.p>
                  <motion.p
                    variants={fadeInUp}
                    className="text-xl leading-relaxed text-white/80"
                  >
                    My approach combines technical excellence with minimalistic
                    design principles.
                  </motion.p>
                </div>
                <div>
                  <motion.div variants={fadeInUp} className="space-y-12">
                    <div>
                      <h3 className="mb-8 text-2xl font-bold tracking-wide font-clash">
                        SKILLS
                      </h3>
                      <motion.div
                        className="grid grid-cols-1 gap-6"
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
            className="px-16 py-32 min-h-screen border-b border-white/10"
          >
            <ScrambleText text="EXPERIENCE" />
            <div className="space-y-16">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-3xl font-bold font-clash">
                      {exp.role}
                    </h3>
                    <span className="text-white/60">{exp.period}</span>
                  </div>
                  <p className="text-xl text-white/80">{exp.company}</p>
                  <p className="mt-4 text-white/60">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section
            id="projects"
            className="px-16 py-32 min-h-screen border-b border-white/10"
          >
            <ScrambleText text="PROJECTS" />

            {/* GitHub Contributions Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto mb-16 w-fit"
            >
              <div className="flex justify-between items-baseline mb-8">
                <h3 className="text-2xl font-bold font-clash">
                  GITHUB ACTIVITY
                </h3>
                {contributions.length > 0 && (
                  <span className="text-white/60">
                    {contributions.reduce((acc, curr) => acc + curr.count, 0)}{" "}
                    contributions in the last year
                  </span>
                )}
              </div>

              <div className="relative">
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
                          const contributionDate = new Date(contribution.date);
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {pinnedRepos.map((repo) => (
                <ProjectCard key={repo.name} repo={repo} />
              ))}
            </div>
          </section>

          {/* Blog Section */}
          <section
            id="blog"
            className="px-16 py-32 min-h-screen border-b border-white/10"
          >
            <ScrambleText text="BLOG" />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-xl text-white/80"
            >
              Thoughts, learnings, and insights about web development and
              design.
            </motion.p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {sampleBlogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="flex justify-center items-center px-16 min-h-screen"
          >
            <div className="w-full max-w-4xl text-center">
              <ScrambleText text="LETS CONNECT" />
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-12 text-xl text-white/80"
              >
                Open to new opportunities and collaborations.
              </motion.p>

              <form className="mx-auto mt-12 space-y-6 max-w-xl">
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
                  className="py-4 w-full font-medium text-black bg-white rounded-lg transition-colors hover:bg-white/90"
                >
                  Send Message
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex gap-8 justify-center mt-16"
              >
                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://www.linkedin.com/in/abhay-ramesh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg tracking-[0.3em] text-white/60 hover:text-white transition-colors font-medium"
                >
                  LINKEDIN
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  href="mailto:contact@abhayramesh.com"
                  className="text-lg tracking-[0.3em] text-white/60 hover:text-white transition-colors font-medium"
                >
                  EMAIL
                </motion.a>
              </motion.div>
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
}
