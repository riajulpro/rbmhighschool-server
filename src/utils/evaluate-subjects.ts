type SubjectInput = {
  written1: number;
  mcq1: number;
  written2?: number;
  mcq2?: number;
  W_PASS: number;
  M_PASS: number;
};

type SubjectResult = {
  total: number;
  grade: string;
  gp: number;
};

type GradeInfo = {
  grade: string;
  gp: number;
};

export function evaluateSubject(input: SubjectInput): SubjectResult {
  const { written1, mcq1, written2 = 0, mcq2 = 0, W_PASS, M_PASS } = input;

  // Apply score sharing logic between written papers
  const [w1, w2] = applyScoreSharing(written1, written2);

  const total = w1 + mcq1 + w2 + mcq2;

  // Check if both papers pass minimum requirements
  const bothPapersPass = checkPassConditions(
    { written: w1, mcq: mcq1 },
    { written: w2, mcq: mcq2 },
    { W_PASS, M_PASS },
    input.written2 !== undefined
  );

  const { grade, gp } = bothPapersPass
    ? getGradeFromTotal(total)
    : { grade: "F", gp: 0 };

  return { total, grade, gp };
}

export function applyScoreSharing(w1: number, w2?: number): [number, number] {
  if (w2 === undefined) return [w1, 0];

  const transferScore = (from: number, to: number) => {
    const extra = from - 80;
    const needed = 80 - to;
    return Math.min(extra, needed);
  };

  if (w1 > 80 && w2 < 80) {
    const transfer = transferScore(w1, w2);
    return [w1 - transfer, w2 + transfer];
  }

  if (w2 > 80 && w1 < 80) {
    const transfer = transferScore(w2, w1);
    return [w1 + transfer, w2 - transfer];
  }

  return [w1, w2];
}

export function checkPassConditions(
  paper1: { written: number; mcq: number },
  paper2: { written: number; mcq: number },
  passMarks: { W_PASS: number; M_PASS: number },
  hasSecondPaper: boolean
): boolean {
  const paperPasses = (paper: { written: number; mcq: number }) =>
    paper.written >= passMarks.W_PASS && paper.mcq >= passMarks.M_PASS;

  const paper1Passes = paperPasses(paper1);
  const paper2Passes = hasSecondPaper ? paperPasses(paper2) : true;

  return paper1Passes && paper2Passes;
}

export function getGradeFromTotal(total: number): GradeInfo {
  const gradeThresholds = [
    { min: 80, grade: "A+", gp: 5 },
    { min: 70, grade: "A", gp: 4 },
    { min: 60, grade: "A-", gp: 3.5 },
    { min: 50, grade: "B", gp: 3 },
    { min: 40, grade: "C", gp: 2 },
    { min: 33, grade: "D", gp: 1 },
  ];

  for (const threshold of gradeThresholds) {
    if (total >= threshold.min) {
      return { grade: threshold.grade, gp: threshold.gp };
    }
  }

  return { grade: "F", gp: 0 };
}
