import OpenAI, { AzureOpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.OPENAI_MODEL;
const AZURE_API_KEY = import.meta.env.AZURE_API_KEY;
const AZURE_API_VERSION = import.meta.env.AZURE_API_VERSION;
const AZURE_ENDPOINT = import.meta.env.AZURE_ENDPOINT;
const AZURE_DEPLOYMENT_NAME = import.meta.env.AZURE_DEPLOYMENT_NAME;

class ChatModel {
  messages: ChatCompletionMessageParam[] = [];

  addMessage(role: "user" | "system", content: string) {
    this.messages.push({ role, content });
  }

  async completeChat(): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    throw new Error("Method not implemented.");
  }
}

class AzureAPI extends ChatModel {
  client: AzureOpenAI;

  constructor() {
    super();
    this.client = new AzureOpenAI({
      apiKey: AZURE_API_KEY,
      apiVersion: AZURE_API_VERSION,
      endpoint: AZURE_ENDPOINT,
      deployment: AZURE_DEPLOYMENT_NAME,
    });
  }

  override async completeChat() {
    return await this.client.chat.completions.create({
      messages: this.messages,
      model: "",
      response_format: { type: "json_object" },
    });
  }
}

class OpenAIAPI extends ChatModel {
  client: OpenAI;
  model: string;

  constructor() {
    super();
    this.client = new OpenAI({ apiKey: OPENAI_API_KEY });
    this.model = OPENAI_MODEL;
  }

  override async completeChat() {
    return await this.client.chat.completions.create({
      messages: this.messages,
      model: this.model,
      response_format: { type: "json_object" },
    });
  }
}

export const createChatModel = () => {
  if (OPENAI_API_KEY && OPENAI_MODEL) {
    console.log("Using OpenAI API");
    return new OpenAIAPI();
  } else if (AZURE_API_KEY && AZURE_API_VERSION && AZURE_ENDPOINT && AZURE_DEPLOYMENT_NAME) {
    console.log("Using Azure API");
    return new AzureAPI();
  }

  throw new Error(
    "No API key found. Please set either OPENAI_API_KEY, and OPENAI_MODEL or AZURE_API_KEY, AZURE_API_VERSION, AZURE_ENDPOINT, and AZURE_DEPLOYMENT_NAME in your environment variables (e.g. in .env or.env.local)."
  );
};
