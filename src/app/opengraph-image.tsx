import { ImageResponse } from "next/og";

export const alt = "Abhay Ramesh - Full Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Patterns */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            opacity: 0.15,
            zIndex: 0,
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.8) 100%)",
            zIndex: 0,
          }}
        />

        {/* Left Border */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            width: "6px",
            height: "100%",
            background: "linear-gradient(180deg, #fff 0%, transparent 100%)",
            opacity: 0.7,
            zIndex: 1,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            zIndex: 1,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            height: "100%",
          }}
        >
          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
              zIndex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              height: "100%",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 84,
                color: "#ffffff",
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                maxWidth: "85%",
                textShadow: "0 4px 20px rgba(0,0,0,0.7)",

                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Abhay Ramesh
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 36,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.4,
                maxWidth: "70%",
                fontWeight: 500,
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              Full Stack Developer crafting modern web apps
            </div>

            {/* Tech Stack */}
            <div
              style={{
                display: "flex",
                gap: 16,
                zIndex: 1,
              }}
            >
              {["TypeScript", "React", "Next.js", "Python", "FastAPI"].map(
                (tech) => (
                  <div
                    key={tech}
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      padding: "12px 24px",
                      borderRadius: 12,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      border: "1.5px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    {tech}
                  </div>
                )
              )}
            </div>
          </div>
          {/* Author Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              zIndex: 1,
              marginBottom: 16,
            }}
          >
            {/* Author Image */}
            <img
              src="https://github.com/abhay-ramesh.png"
              alt="Abhay Ramesh"
              style={{
                width: 300,
                height: 300,
                borderRadius: 75,
                border: "4px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
