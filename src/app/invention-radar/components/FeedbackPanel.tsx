import React, { useState } from "react";

interface FeedbackPanelProps {
  onReset: () => void;
}

export default function FeedbackPanel({ onReset }: FeedbackPanelProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (rating !== null) {
      setSubmitted(true);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">💬 Feedback Panel</h2>

      {submitted ? (
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm font-semibold text-green-700">Thanks for your feedback! 🙌</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setRating(null);
              setComment("");
              onReset();
            }}
            className="mt-3 rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Analyze Another Invention
          </button>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-600">How useful was this analysis?</p>

          <div className="mb-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  rating !== null && star <= rating ? "opacity-100" : "opacity-30"
                }`}
              >
                ⭐
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any comments? (optional)"
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200 resize-none"
          />

          <div className="mt-3 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={rating === null}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
            <button
              onClick={onReset}
              className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              Start Over
            </button>
          </div>
        </>
      )}
    </div>
  );
}
