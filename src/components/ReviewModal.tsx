import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { CollabRequest, Review } from '../types';
import { Star, ShieldAlert, CheckCircle, Award } from 'lucide-react';

interface ReviewModalProps {
  request: CollabRequest;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ request, onClose }) => {
  const { activeUser, submitReview } = useApp();

  const isReviewerCreator = activeUser.id === request.creatorId;

  // Star states
  const [overall, setOverall] = useState(5);
  const [wouldReturn, setWouldReturn] = useState<boolean>(true);

  // Criteria grades
  const [crit1, setCrit1] = useState(5); // Professionalism (for Creator reviewer) or Communication (for Professional reviewer)
  const [crit2, setCrit2] = useState(5); // Communication (for Creator reviewer) or Payment Reliability (for Professional reviewer)
  const [crit3, setCrit3] = useState(5); // Quality (for Creator reviewer) or Requirement Clarity (for Professional reviewer)
  const [crit4, setCrit4] = useState(5); // Punctuality (for Creator reviewer) or Professional Behaviour (for Professional reviewer)
  const [crit5, setCrit5] = useState(5); // Value for Money (for Creator) or Collaboration Experience (for Pro)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const breakdownData = isReviewerCreator ? {
      professionalism: crit1,
      communication: crit2,
      quality: crit3,
      punctuality: crit4,
      valueForMoney: crit5
    } : {
      communication: crit1,
      paymentReliability: crit2,
      requirementClarity: crit3,
      professionalBehaviour: crit4,
      collaborationExperience: crit5
    };

    submitReview({
      requestId: request.id,
      projectTitle: request.title,
      revieweeId: isReviewerCreator ? request.professionalId : request.creatorId,
      revieweeName: isReviewerCreator ? request.professionalName : request.creatorName,
      type: isReviewerCreator ? 'creator-to-professional' : 'professional-to-creator',
      overallRating: overall,
      writtenReview: "Completed",
      wouldRecommendAgain: PIN_RECOMMEND(wouldReturn),
      breakdown: breakdownData
    });

    onClose();
  };

  const PIN_RECOMMEND = (val: boolean) => val;

  const renderStarsSelector = (starsValue: number, setStars: (val: number) => void, label: string) => (
    <div className="flex items-center justify-between text-xs py-1">
      <span className="text-brand-muted font-medium font-sans">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button 
            type="button"
            key={s}
            onClick={() => setStars(s)}
            className="p-0.5 hover:scale-110 transition cursor-pointer"
          >
            <Star className={`w-4 h-4 ${s <= starsValue ? 'text-brand-warning fill-brand-warning' : 'text-slate-200'}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-brand-border/60 max-w-lg w-full overflow-hidden shadow-xl animate-scaleIn text-left flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-brand-text text-white p-4 sm:p-5 flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary opacity-20 blur-xl"></div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-brand-accent tracking-widest block mb-0.5">Peer Collab Assessment</span>
            <h3 className="font-display font-extrabold text-sm sm:text-base">Reviews compulsory lockout</h3>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          <div className="bg-brand-bg-cream border border-brand-primary/10 p-4 rounded-2xl">
            <h4 className="font-bold text-xs text-brand-text mb-1 leading-tight">Project: "{request.title}"</h4>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              Evaluating your experience with <strong>{isReviewerCreator ? request.professionalName : request.creatorName}</strong> on {request.date}. Double-blind rules enforce absolute honesty.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#0F172A] border-b pb-1 font-mono">1. Rate overall performance</h5>
            
            <div className="flex justify-between items-center py-2 bg-brand-bg-cream/40 px-3 rounded-xl border border-brand-border/40">
              <span className="text-xs font-bold text-brand-text">Overall Star Rating</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    type="button"
                    key={s}
                    className="p-1 cursor-pointer"
                    onClick={() => {
                      setOverall(s);
                      // sync subcategories initially if desired
                    }}
                  >
                    <Star className={`w-5 h-5 ${s <= overall ? 'text-brand-warning fill-brand-warning' : 'text-slate-150'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subcriteria breakdowns */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-brand-text border-b pb-1 font-mono">2. Category Breakdown Scores</h5>
            <div className="grid grid-cols-1 gap-2.5 bg-brand-bg-cream/40 p-3 rounded-2xl border border-brand-border/40">
              {isReviewerCreator ? (
                <>
                  {renderStarsSelector(crit1, setCrit1, 'Professionalism & Style')}
                  {renderStarsSelector(crit2, setCrit2, 'Communication & Speed')}
                  {renderStarsSelector(crit3, setCrit3, 'Quality of Deliverables')}
                  {renderStarsSelector(crit4, setCrit4, 'Punctuality on Location')}
                  {renderStarsSelector(crit5, setCrit5, 'Value for Money Rate')}
                </>
              ) : (
                <>
                  {renderStarsSelector(crit1, setCrit1, 'Response & Communication')}
                  {renderStarsSelector(crit2, setCrit2, 'Payment & Fee Reliability')}
                  {renderStarsSelector(crit3, setCrit3, 'Requirement & Goal Clarity')}
                  {renderStarsSelector(crit4, setCrit4, 'Professional Behavior')}
                  {renderStarsSelector(crit5, setCrit5, 'Collaboration Quality')}
                </>
              )}
            </div>
          </div>

          {/* Testimonial field removed */}

          {/* Would hire or collab again? */}
          <div className="flex items-center justify-between py-2 bg-brand-bg-cream/40 px-3 rounded-xl border border-brand-border/40">
            <span className="text-xs font-bold text-brand-text">Would you work with this user again?</span>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setWouldReturn(true)}
                className={`py-1 px-4 text-xs font-bold rounded-lg cursor-pointer ${
                  wouldReturn 
                    ? 'bg-brand-success text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-brand-text'
                }`}
              >
                Yes
              </button>
              <button 
                type="button"
                onClick={() => setWouldReturn(false)}
                className={`py-1 px-4 text-xs font-bold rounded-lg cursor-pointer ${
                  !wouldReturn 
                    ? 'bg-brand-danger text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-brand-text'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Action triggers */}
          <div className="pt-2 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 border border-brand-border py-2.5 rounded-xl font-bold text-xs text-brand-text hover:bg-brand-bg-soft text-center cursor-pointer"
            >
              Cancel Evaluation
            </button>
            <button 
              type="submit"
              className="flex-1 bg-brand-primary hover:bg-brand-primary/95 py-2.5 rounded-xl font-bold text-xs text-white text-center cursor-pointer"
            >
              Submit Compulsory Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
