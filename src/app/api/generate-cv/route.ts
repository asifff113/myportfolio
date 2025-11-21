/**
 * API Route: Generate and Download CV/Resume
 * GET /api/generate-cv
 * Generates a PDF resume based on portfolio content
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { CVTemplate } from '@/components/cv/CVTemplate';
import { getAllPublicContent } from '@/lib/content';
import React from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Required for PDF generation

export async function GET(request: NextRequest) {
  try {
    // Fetch all portfolio content
    const content = await getAllPublicContent();

    if (!content.personalInfo) {
      return NextResponse.json(
        { error: 'Personal information not found' },
        { status: 404 }
      );
    }

    // Generate PDF stream
    const cvDocument = React.createElement(CVTemplate, { content });
    const pdfStream = await renderToStream(cvDocument as any);

    // Convert Node.js Readable stream to Buffer
    const chunks: Buffer[] = [];
    
    for await (const chunk of pdfStream as any) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    // Generate filename with person's name
    const filename = `${content.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;

    // Return PDF file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating CV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CV', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
