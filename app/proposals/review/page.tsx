import { LegalReviewFlow } from '@/components/LegalReviewFlow';

export default async function ReviewProposalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-0">
      <LegalReviewFlow 
        fanName="Jordan Fan" 
        athleteName={params.athleteName || "Placeholder Athlete"}
        eventName={params.eventName || ""}
        merchDesc={params.merchDesc || "Custom Merch Design"}
        revSplitFan={Number(params.revSplitFan) || 70}
        termMonths={Number(params.termMonths) || 12}
        hasLiveContent={params.hasLiveContent === 'true'}
      />
    </div>
  );
}
