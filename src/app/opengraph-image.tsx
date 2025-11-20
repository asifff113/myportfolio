import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'Portfolio - Full Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Background Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: '#8b5cf6',
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: '#06b6d4',
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.3,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              background: 'linear-gradient(to right, #60a5fa, #a855f7, #ec4899)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Full Stack Developer
          </div>
          
          <div
            style={{
              fontSize: 32,
              color: '#94a3b8',
              marginBottom: 40,
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Building futuristic web experiences with Next.js, React & Supabase
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            {['React', 'Next.js', 'TypeScript', 'Supabase', 'Tailwind'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50px',
                  fontSize: 20,
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
