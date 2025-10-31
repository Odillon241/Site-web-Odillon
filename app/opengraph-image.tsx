import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Odillon - Ingénierie d\'Entreprises'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#1A9B8E',
              marginRight: '30px',
            }}
          />
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#1A9B8E',
            }}
          >
            ODILLON
          </div>
        </div>
        <div
          style={{
            fontSize: '36px',
            fontStyle: 'italic',
            color: '#0A1F2C',
          }}
        >
          Ingénierie d'Entreprises
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

