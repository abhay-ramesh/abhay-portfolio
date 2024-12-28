import { ImageResponse } from "next/og";

export const alt = "Blog | Abhay Ramesh";
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
            opacity: 0.3,
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
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
            zIndex: 0,
          }}
        />

        {/* Left Border */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            width: "4px",
            height: "100%",
            background: "linear-gradient(180deg, #fff 0%, transparent 100%)",
            opacity: 0.5,
            zIndex: 1,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 48,
            zIndex: 1,
            width: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 72,
              color: "#ffffff",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              maxWidth: "85%",
              textShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            Blog
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.4,
              maxWidth: "70%",
            }}
          >
            Thoughts on software development, tech, and more.
          </div>
        </div>

        {/* Author Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            zIndex: 1,
          }}
        >
          {/* Author Image */}
          <img
            src="https://github.com/abhay-ramesh.png"
            alt="Abhay Ramesh"
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              border: "3px solid rgba(255, 255, 255, 0.8)",
            }}
          />
          {/* Author Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#ffffff",
              }}
            >
              Abhay Ramesh
            </div>
            <div
              style={{
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.7)",
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
            >
              Full Stack Developer
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
