type color =
  | "primary"
  | "error"
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | undefined;
export interface InputColorMessage {
  text: string;
  color: color;
}

export type fromRegisterContextType = {
  fromRegister: boolean;
  setFromRegister: (value: boolean) => void;
};

export type UserData = {
  username: string;
  photoURL: string;
};

export type AvatarProperties = {
  gender: string;
  backgroundColor: string;
  mouthColor: string;
  eyeColor: string;
  eyelidsColor: string;
  hairColor: string;
  skinColor: string;
  noseColor: string;
  bowColor?: string;
  dimensions: string;
}

export type FlashcardSet = {
  title: string;
  description: string;
  cover: string;
  category: string[];
  flashcards: { [key: string]: string };
};

export type ErrorMessasge = string | null;
