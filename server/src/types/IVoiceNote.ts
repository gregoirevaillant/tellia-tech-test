import { PredefinedSchema, DynamicSchema } from "./IStructuredData";

export interface IStructuredData {
  predefined: PredefinedSchema;
  dynamic: DynamicSchema;
}

export interface IVoiceNote {
  _id: string;
  transcript: string;
  structuredData?: IStructuredData;
  createdAt: Date;
  updatedAt: Date;
}
