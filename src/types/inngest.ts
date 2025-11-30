export interface InngestSessionResponse {
  response: string;
  analysis: {
    emotionalState: string;
    themes: string[];
    riskLevel: number;
    recommendedApproach: string;
    progressIndicators: string[];
  };
  updatedMemory: any;
}

export interface InngestEvent {
  name: string;
  data: any;
}
