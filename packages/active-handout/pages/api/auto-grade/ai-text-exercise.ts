import type { APIRoute } from "astro";

import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import { createChatModel } from "./chat-model";
import { loadExerciseOrError } from "./utils";

const t = useTranslations(config.lang);

async function promptAI(
  question: string,
  expectedAnswer: string,
  studentAnswer: string,
  extraPrompt?: string
) {
  const model = createChatModel();

  let expectedAnswerPrompt = "";
  if (expectedAnswer) {
    expectedAnswerPrompt = ` The expected answer is (this is the official answer and you shouldn't consider anything else correct, even if you have additional information about this topic): "${expectedAnswer}". `;
  }

  let systemPrompt = `You are a smart tutor API. The question statement is: "${question}".${expectedAnswerPrompt} Return an unformated JSON object in the format {"points": number, "feedback": string}. "points" is one of the following numbers: 0 = incorrect or empty, 50 = partially correct, 100 = correct. Consider an answer correct if it contains the information in the expected answer, consider it partially correct if it omits some important information from the expected answer, but is close to the correct answer. The "feedback" attribute is a valid JavaScript string containing your short feedback to the student. Give hints of what's missing or could be improved, but avoid giving away the answer. The "feedback" should be written in ${config.lang}. If you detect that the student is using a different language, write the feedback in that language. The feedback string accepts HTML and katex classes.`;
  if (extraPrompt) {
    systemPrompt += ` ${extraPrompt}`;
  }

  model.addMessage("system", systemPrompt);
  model.addMessage("user", studentAnswer || "");

  return await model.completeChat();
}

export const POST: APIRoute = async ({ request }) => {
  const { data, exercise, response } = await loadExerciseOrError<{ studentAnswer: string }>(await request.json());
  if (response) {
    return response;
  }

  const completion = await promptAI(
    exercise.data.question,
    exercise.data.expectedAnswer,
    data.studentAnswer,
    exercise.data.extraPrompt
  );

  let percentComplete = 0;
  let feedback = t("ai.error");
  try {
    const message = completion.choices[0]?.message.content;
    if (message) {
      const smartTutorResponse = JSON.parse(message);
      percentComplete = smartTutorResponse.points;
      feedback = smartTutorResponse.feedback;
    }
  } catch (e) {
    console.error(e);
    console.log(`Caused by: ${completion.choices[0]?.message.content}`);
  }

  return new Response(
    JSON.stringify({
      percentComplete,
      data: { ...data, feedback },
    }),
    { status: 200 }
  );
};
