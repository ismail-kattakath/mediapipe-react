"use client";

import React, { createContext, useContext, useMemo } from "react";
import { isBrowser } from "./utils";

export * from "./genai";
export * from "./vision";
export * from "./audio";

export interface MediaPipeContextType {
  wasmPath?: string;
  modelPath?: string;
  isBrowser: boolean;
}

const MediaPipeContext = createContext<MediaPipeContextType | null>(null);

export interface MediaPipeProviderProps {
  children: React.ReactNode;
  wasmPath?: string;
  modelPath?: string;
}

export const MediaPipeProvider: React.FC<MediaPipeProviderProps> = ({
  children,
  wasmPath,
  modelPath,
}) => {
  const value = useMemo(
    () => ({
      wasmPath,
      modelPath,
      isBrowser,
    }),
    [wasmPath, modelPath],
  );

  return (
    <MediaPipeContext.Provider value={value}>
      {children}
    </MediaPipeContext.Provider>
  );
};

export const useMediaPipeContext = () => {
  const context = useContext(MediaPipeContext);
  if (!context) {
    throw new Error(
      "useMediaPipeContext must be used within a MediaPipeProvider",
    );
  }
  return context;
};
