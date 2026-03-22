import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { dealId, fanName, athleteName, athleteEmail, fanEmail, productName, termLength, dealType, fanSplit, thumbnailUrl, aiDesignUrl } = await request.json();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const isVideo = dealType === 'Event Video';
    const athSplit = 100 - (fanSplit || 0);

    const masterProposalText = `PARTNERSHIP PROPOSAL: ${productName}<br/><br/>Parties: ${fanName} ("Fan") and ${athleteName} ("Athlete")<br/>The Trigger Moment: ${isVideo ? 'Live Event Content' : 'Purely Creative NIL Design'}<br/>The Product: ${productName}<br/>Revenue Split: ${athSplit}% to Athlete / ${fanSplit}% to Fan<br/>Term: Active for ${termLength} from the date of first sale.<br/>Reporting: Monthly basis.`;

    const publicityText = isVideo 
      ? `LIMITED RIGHT OF PUBLICITY RELEASE<br/><br/>Grant: Athlete grants Fan (${fanName}) the right to use Athlete's name, image, and likeness (NIL) solely in connection with the production, marketing, and sale of the Merch Project stemming from the captured Event Media.<br/>Term-Bound: Strictly limited to ${termLength}.`
      : `LIMITED RIGHT OF PUBLICITY & NIL RELEASE<br/><br/>Grant: Athlete explicitly grants Fan (${fanName}) the right to use Athlete's name, image, and likeness (NIL) and monetize their face solely for the preparation, sale, and launch of the Merch Project.<br/>Term-Bound: Strictly limited to ${termLength}. Upon expiration, Fan must cease all use unless renewed.<br/>Approval: Athlete has the right to approve the final design before sale.`;

    const copyrightText = isVideo
      ? `NON-EXCLUSIVE CONTENT LICENSE (EVENT MEDIA)<br/><br/>Grant of License: Fan (${fanName}) hereby grants Athlete a non-exclusive, sub-licensable, royalty-free license to use, reproduce, and display the Video/Media captured in perpetuity.<br/>Scope: Athlete may use the content for social media promotion, personal branding, and the specific Merch Project.<br/>Ownership: Fan retains all underlying copyright.`
      : `NON-EXCLUSIVE CONTENT LICENSE (DESIGN WORK)<br/><br/>Grant of License: Fan (${fanName}) hereby grants Athlete a non-exclusive license to utilize the purely creative Merch Design for promotional purposes.<br/>Ownership: Fan retains all underlying copyright to the graphic/art elements they produced. Athlete does not own the design file but can use it as specified.`;

    const emailBody = `
      <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: auto;">
        <h2>Partnership Contract Automatically Executed</h2>
        <p>This securely verifies that a legal NIL partnership has been electronically signed and fully executed on the million$NIL platform between <strong>${fanName}</strong> and <strong>${athleteName}</strong>.</p>
        
        <hr style="border:1px solid #eee; margin:20px 0" />
        
        <h3>I. The Master Proposal Agreement</h3>
        <p style="background:#f9f9f9; padding:15px; border-left:4px solid #F6DF02">${masterProposalText}</p>
        
        <h3>II. Right of Publicity Partial Release</h3>
        <p style="background:#f9f9f9; padding:15px; border-left:4px solid #F6DF02">${publicityText}</p>
        
        <h3>III. Fan Copyright License</h3>
        <p style="background:#f9f9f9; padding:15px; border-left:4px solid #F6DF02">${copyrightText}</p>

        <hr style="border:1px solid #eee; margin:20px 0" />
        
        <h3>Exhibit A: Approved Creative Media</h3>
        <p>The following digital media is legally bound to this Master Proposal Agreement.</p>
        <div style="margin-top: 15px; padding-bottom: 20px;">
          ${thumbnailUrl ? `<div style="display: inline-block; vertical-align: top; margin-right: 20px; text-align: center;"><img src="${thumbnailUrl}" style="width: 200px; height: auto; border-radius: 8px; border: 1px solid #ddd;" /><br/><span style="font-size: 11px; color: #666; font-weight: bold;">SOURCE MEDIA</span></div>` : ''}
          ${aiDesignUrl ? `<div style="display: inline-block; vertical-align: top; margin-right: 20px; text-align: center;"><img src="${aiDesignUrl}" style="width: 200px; height: auto; border-radius: 8px; border: 4px solid #F6DF02;" /><br/><span style="font-size: 11px; color: #666; font-weight: bold;">AI PROPOSAL DESIGN</span></div>` : ''}
        </div>

        <hr style="border:1px solid #eee; margin:20px 0" />
        <p><strong>Status:</strong> Legally Enacted as of ${new Date().toLocaleDateString()}</p>
        <p>You may both now proceed to production, distribution, and promotion. Ensure all earnings payouts respect the ${athSplit}/${fanSplit} split structure.</p>
        <br />
        <small style="color: #666;">Powered by million$NIL Cryptographic Ledgers</small>
      </div>
    `;

    // For the unverified MVP testing environment, Resend strictly requires all emails to
    // route only to your verified account address. If you pass a fake "athlete@gmail.com"
    // the system throws an instant block. We will route all demo receipts to your verified inbox.
    const recipients = ['llokigrill@gmail.com'];

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'million$NIL <onboarding@resend.dev>',
        to: recipients,
        subject: `EXECUTED: ${productName} by ${fanName} x ${athleteName}`,
        html: emailBody,
      }),
    });

    if (res.ok) {
        return NextResponse.json({ success: true, message: "Receipt sent securely." });
    } else {
        const err = await res.json();
        console.error("Resend API Exception:", err);
        return NextResponse.json({ error: err.message || "Resend Blocked Send" }, { status: 400 });
    }
  } catch (error) {
    console.error("System Exception:", error);
    return NextResponse.json({ error: "Server exception" }, { status: 500 });
  }
}
