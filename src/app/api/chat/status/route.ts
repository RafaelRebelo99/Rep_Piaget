import { NextResponse } from 'next/server'

export async function GET() {
  const online = !!process.env.GOOGLE_API_KEY
  return NextResponse.json({ online })
}
