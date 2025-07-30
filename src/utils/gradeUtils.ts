export const getGradeAndPoint = (marks: number) => {
  if (marks >= 80) return { grade: "A+", point: 5.0 };
  if (marks >= 70) return { grade: "A", point: 4.0 };
  if (marks >= 60) return { grade: "A-", point: 3.5 };
  if (marks >= 50) return { grade: "B", point: 3.0 };
  if (marks >= 40) return { grade: "C", point: 2.0 };
  if (marks >= 33) return { grade: "D", point: 1.0 };
  return { grade: "F", point: 0.0 };
};

export const getOverallGradeFromGPA = (gpa: number): string => {
  if (gpa === 5.0) return "A+";
  else if (gpa >= 4.0) return "A";
  else if (gpa >= 3.5) return "A-";
  else if (gpa >= 3.0) return "B";
  else if (gpa >= 2.0) return "C";
  else if (gpa >= 1.0) return "D";
  else return "F";
};
