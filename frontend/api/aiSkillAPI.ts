const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface CollectorResponse {
  status: "collecting" | "complete";
  current_data: {
    skill?: string;
    goal?: string;
    experience?: string;
    deadline?: string;
  };
  missing_fields: string[];
  next_question?: string;
}

export interface SkillItem {
  color: string;
  goal: string;
  icon: string;
  tip: string;
  title: string;
  todos: Array<{
    status: boolean;
    text: string;
  }>;
}

export class AISkillAPI {
  static async startCollection(message: string): Promise<CollectorResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/collect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async continueCollection(
    currentData: CollectorResponse["current_data"],
    message: string
  ): Promise<CollectorResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/collect-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_data: currentData,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async generateSkillPlan(
    collectorData: CollectorResponse
  ): Promise<SkillItem> {
    const response = await fetch(`${API_BASE_URL}/ai/generate-skill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectorData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
