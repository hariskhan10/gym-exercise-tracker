import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pplPlan = {
  name: "Fat Loss + Muscle Retention PPL",
  description: "Push Pull Legs split — 6 training days + 1 recovery",
  days: [
    {
      dayNumber: 1,
      label: "Day 1 – Push",
      focus: "Chest, Shoulders, Triceps",
      isRest: false,
      exercises: [
        { name: "Barbell Bench Press", muscleGroup: "Chest", sets: 4, reps: "6-8", order: 1, youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
        { name: "Incline Dumbbell Press", muscleGroup: "Chest", sets: 3, reps: "8-10", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
        { name: "Cable Fly", muscleGroup: "Chest", sets: 3, reps: "12-15", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=WEM9FCIPlxQ" },
        { name: "Seated DB Shoulder Press", muscleGroup: "Shoulders", sets: 3, reps: "8-10", order: 4, youtubeUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog" },
        { name: "Lateral Raise", muscleGroup: "Shoulders", sets: 3, reps: "15", order: 5, youtubeUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo" },
        { name: "Rope Pushdown", muscleGroup: "Triceps", sets: 3, reps: "12", order: 6, youtubeUrl: "https://www.youtube.com/watch?v=kiuVA0gs3EI" },
        { name: "Overhead Extension", muscleGroup: "Triceps", sets: 3, reps: "12", order: 7, youtubeUrl: "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q" },
        { name: "20 min Incline Treadmill", muscleGroup: "Cardio", sets: 1, reps: "20 min", order: 8, notes: "Moderate pace, 8-10% incline" },
      ],
    },
    {
      dayNumber: 2,
      label: "Day 2 – Pull",
      focus: "Back, Rear Delts, Biceps",
      isRest: false,
      exercises: [
        { name: "Barbell Row", muscleGroup: "Back", sets: 3, reps: "8-10", order: 1, youtubeUrl: "https://www.youtube.com/watch?v=FWJR5Ve8bnQ" },
        { name: "Lat Pulldown", muscleGroup: "Back", sets: 4, reps: "8-10", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc" },
        { name: "Seated Cable Row", muscleGroup: "Back", sets: 3, reps: "10", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=GZbfZ033f74" },
        { name: "Face Pulls", muscleGroup: "Rear Delts", sets: 3, reps: "15", order: 4, youtubeUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk" },
        { name: "Barbell Curl", muscleGroup: "Biceps", sets: 3, reps: "10", order: 5, youtubeUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo" },
        { name: "Hammer Curl", muscleGroup: "Biceps", sets: 3, reps: "12", order: 6, youtubeUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4" },
        { name: "20 min Incline Treadmill", muscleGroup: "Cardio", sets: 1, reps: "20 min", order: 7, notes: "Moderate pace, 8-10% incline" },
      ],
    },
    {
      dayNumber: 3,
      label: "Day 3 – Legs",
      focus: "Quads, Hamstrings, Calves",
      isRest: false,
      exercises: [
        { name: "Squat", muscleGroup: "Quads", sets: 4, reps: "6-8", order: 1, youtubeUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
        { name: "Leg Press", muscleGroup: "Quads", sets: 3, reps: "12", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" },
        { name: "Romanian Deadlift", muscleGroup: "Hamstrings", sets: 3, reps: "10", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
        { name: "Leg Curl", muscleGroup: "Hamstrings", sets: 3, reps: "12", order: 4, youtubeUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs" },
        { name: "Leg Extension", muscleGroup: "Quads", sets: 3, reps: "15", order: 5, youtubeUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0" },
        { name: "Calf Raise", muscleGroup: "Calves", sets: 4, reps: "15", order: 6, youtubeUrl: "https://www.youtube.com/watch?v=-M4-G8p1fCI" },
        { name: "15 min Brisk Walk", muscleGroup: "Cardio", sets: 1, reps: "15 min", order: 7, notes: "Cool down walk" },
      ],
    },
    {
      dayNumber: 4,
      label: "Day 4 – Push 2",
      focus: "Chest, Shoulders, Triceps",
      isRest: false,
      exercises: [
        { name: "Incline Barbell Press", muscleGroup: "Chest", sets: 4, reps: "8", order: 1, youtubeUrl: "https://www.youtube.com/watch?v=DbFgADa2PL8" },
        { name: "Flat Dumbbell Press", muscleGroup: "Chest", sets: 3, reps: "10", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=QsYre__-aro" },
        { name: "Pec Deck Fly", muscleGroup: "Chest", sets: 3, reps: "15", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=Z57CtFmRMxA" },
        { name: "Arnold Press", muscleGroup: "Shoulders", sets: 3, reps: "10", order: 4, youtubeUrl: "https://www.youtube.com/watch?v=6Z15_WdXmVw" },
        { name: "Lateral Raise", muscleGroup: "Shoulders", sets: 3, reps: "15", order: 5, youtubeUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo" },
        { name: "Skull Crushers", muscleGroup: "Triceps", sets: 3, reps: "10", order: 6, youtubeUrl: "https://www.youtube.com/watch?v=d_KZxkY_0cM" },
        { name: "Rope Pushdown", muscleGroup: "Triceps", sets: 3, reps: "15", order: 7, youtubeUrl: "https://www.youtube.com/watch?v=kiuVA0gs3EI" },
        { name: "20 min Incline Treadmill", muscleGroup: "Cardio", sets: 1, reps: "20 min", order: 8 },
      ],
    },
    {
      dayNumber: 5,
      label: "Day 5 – Pull 2",
      focus: "Back, Rear Delts, Biceps",
      isRest: false,
      exercises: [
        { name: "Deadlift", muscleGroup: "Back", sets: 3, reps: "5", order: 1, youtubeUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q" },
        { name: "T-Bar Row", muscleGroup: "Back", sets: 3, reps: "8", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=j3Igk5nyZE4" },
        { name: "One Arm DB Row", muscleGroup: "Back", sets: 3, reps: "10", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=roCP6wCXPqo" },
        { name: "Reverse Pec Deck", muscleGroup: "Rear Delts", sets: 3, reps: "15", order: 4, youtubeUrl: "https://www.youtube.com/watch?v=Pb4sxgnmKHU" },
        { name: "Preacher Curl", muscleGroup: "Biceps", sets: 3, reps: "10", order: 5, youtubeUrl: "https://www.youtube.com/watch?v=fIWP-FRFNU0" },
        { name: "Cable Curl", muscleGroup: "Biceps", sets: 3, reps: "12", order: 6, youtubeUrl: "https://www.youtube.com/watch?v=NFzTWp2qpiE" },
        { name: "20 min Incline Treadmill", muscleGroup: "Cardio", sets: 1, reps: "20 min", order: 7 },
      ],
    },
    {
      dayNumber: 6,
      label: "Day 6 – Legs + Fat Loss Focus",
      focus: "Full Legs + Metabolic Finisher",
      isRest: false,
      exercises: [
        { name: "Hack Squat", muscleGroup: "Quads", sets: 4, reps: "10", order: 1, youtubeUrl: "https://www.youtube.com/watch?v=0tn5K9NlCfo" },
        { name: "Walking Lunges", muscleGroup: "Quads", sets: 3, reps: "12/leg", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs" },
        { name: "Romanian Deadlift", muscleGroup: "Hamstrings", sets: 3, reps: "10", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
        { name: "Seated Leg Curl", muscleGroup: "Hamstrings", sets: 3, reps: "15", order: 4, youtubeUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs" },
        { name: "Hip Thrust", muscleGroup: "Glutes", sets: 3, reps: "12", order: 5, youtubeUrl: "https://www.youtube.com/watch?v=xDmFkJxPzeM" },
        { name: "Calf Raise", muscleGroup: "Calves", sets: 4, reps: "20", order: 6, youtubeUrl: "https://www.youtube.com/watch?v=-M4-G8p1fCI" },
        { name: "Kettlebell Swings (Fat Loss Finisher)", muscleGroup: "Full Body", sets: 3, reps: "15", order: 7, notes: "3 Rounds: 15 KB Swings → 15 BW Squats → 30s Battle Rope → 30s Rest", youtubeUrl: "https://www.youtube.com/watch?v=YSxHifyI6s8" },
        { name: "Bodyweight Squats (Finisher)", muscleGroup: "Full Body", sets: 3, reps: "15", order: 8 },
        { name: "Battle Rope (Finisher)", muscleGroup: "Full Body", sets: 3, reps: "30 sec", order: 9, youtubeUrl: "https://www.youtube.com/watch?v=kE3MwzNVMF8" },
      ],
    },
    {
      dayNumber: 7,
      label: "Day 7 – Recovery",
      focus: "Active Recovery",
      isRest: true,
      exercises: [
        { name: "45-60 min Walk", muscleGroup: "Cardio", sets: 1, reps: "45-60 min", order: 1, notes: "Easy pace outdoor or treadmill" },
        { name: "Full Body Stretching", muscleGroup: "Mobility", sets: 1, reps: "15-20 min", order: 2, youtubeUrl: "https://www.youtube.com/watch?v=sTxC3J3gQEU" },
        { name: "Mobility Work", muscleGroup: "Mobility", sets: 1, reps: "10-15 min", order: 3, youtubeUrl: "https://www.youtube.com/watch?v=FSSDLDhbacc" },
      ],
    },
  ],
};

async function main() {
  console.log("Seeding database...");

  const plan = await prisma.workoutPlan.create({
    data: {
      name: pplPlan.name,
      description: pplPlan.description,
      isDefault: true,
    },
  });

  for (const day of pplPlan.days) {
    const workoutDay = await prisma.workoutDay.create({
      data: {
        planId: plan.id,
        dayNumber: day.dayNumber,
        label: day.label,
        focus: day.focus,
        isRest: day.isRest,
      },
    });

    for (const ex of day.exercises) {
      await prisma.exercise.create({
        data: {
          dayId: workoutDay.id,
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          sets: ex.sets,
          reps: ex.reps,
          order: ex.order,
          youtubeUrl: ex.youtubeUrl ?? null,
          notes: ex.notes ?? null,
        },
      });
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
