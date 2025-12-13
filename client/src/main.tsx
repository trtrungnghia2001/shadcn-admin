import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./features/theme/data/provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatProvider from "./features/chats/data/provider.tsx";
import { VideoCallProvider } from "./features/chats/data/videoCall.context.tsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ChatProvider>
            <VideoCallProvider>
              <App />
            </VideoCallProvider>
          </ChatProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
