import { evaluateSubject } from "./evaluate-subjects";

const n = (v: any) => (typeof v === "number" ? v : Number(v) || 0);
const pass33 = (outOf: number) => Math.ceil(n(outOf) * 0.33);

export type AnySubject = {
  subject: string;
  marks: {
    written?: { score?: number; outOf?: number };
    mcq?: { score?: number; outOf?: number };
    total?: number;
  };
  comments?: string;
};

export function evaluateOneSubject(sub: AnySubject) {
  const wScore = n(sub.marks?.written?.score);
  const wOut = n(sub.marks?.written?.outOf);
  const mScore = n(sub.marks?.mcq?.score);
  const mOut = n(sub.marks?.mcq?.outOf);

  const W_PASS = pass33(wOut);
  const M_PASS = pass33(mOut); // 0 if no MCQ

  const { total, grade, gp } = evaluateSubject({
    written1: wScore,
    mcq1: mScore,
    // no second paper in this subject object
    W_PASS,
    M_PASS,
  });

  return {
    doc: {
      subject: sub.subject,
      marks: {
        written: { score: wScore, outOf: wOut },
        mcq: { score: mScore, outOf: mOut },
        total,
      },
      grade,
      point: gp,
      comments: sub.comments ?? "",
    },
    gp,
  };
}
