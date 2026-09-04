import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1A1714 0%, #2E2822 50%, #1A1714 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            border: '1.5px solid #D9AE55',
            padding: '60px 80px',
          }}
        >
          <div
            style={{
              fontSize: 52,
              color: '#F0D492',
              letterSpacing: '6px',
              fontWeight: 400,
            }}
          >
            ASTRORISHI
          </div>
          <div
            style={{
              width: 80,
              height: 1.5,
              background: '#D9AE55',
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: '#D9AE55',
              letterSpacing: '3px',
              textTransform: 'uppercase' as const,
            }}
          >
            Personalised Reports
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#B8B0A6',
              textAlign: 'center',
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Numerology &amp; astrology reports worked out from your name and birth date
          </div>
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '8px',
            }}
          >
            {['From ₹249', 'Instant delivery', 'WhatsApp & email'].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 13,
                  color: '#D9AE55',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase' as const,
                  border: '1px solid #4A4038',
                  padding: '6px 14px',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
