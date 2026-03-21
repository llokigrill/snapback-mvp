import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, intent, tier } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Workflow: Record the submission in Supabase
    if (supabaseAdmin) {
      const { error: dbError } = await supabaseAdmin
        .from('submissions')
        .insert([{ 
          email, 
          project_title: intent || 'New App Idea', 
          tier,
          tool_selections: body.tools || {} 
        }]);

      if (dbError) {
        console.error('Supabase DB Error:', dbError);
        // We do not fail the email dispatch if DB fails, allowing for graceful degradation
      }
    }

    // Workflow: Send the Email
    // Replace with your actual email logic when ready
    const { data, error: emailError } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Foundation Stack: Your Request',
      html: `<h1>Thanks for your request!</h1><p>We've received your intent: ${intent}</p>`
    });

    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
