import { ThemeProvider } from "./components/ThemeProvider";
import { TMDbPostsProvider } from "./contexts/TMDbPostsContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { RSSFeedsProvider } from "./contexts/RSSFeedsContext";
import { VideoStudioTemplatesProvider } from "./contexts/VideoStudioTemplatesContext";
import { UndoProvider } from "./components/UndoContext";
import { AppContent } from "./components/AppContent";
import { LoadingScreen } from "./components/LoadingScreen";
import { useState, useEffect } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <SettingsProvider>
          <NotificationsProvider>
            <RSSFeedsProvider>
              <VideoStudioTemplatesProvider>
                <TMDbPostsProvider>
                  <UndoProvider>
                    <AppContent />
                  </UndoProvider>
                </TMDbPostsProvider>
              </VideoStudioTemplatesProvider>
            </RSSFeedsProvider>
          </NotificationsProvider>
        </SettingsProvider>
      )}
    </ThemeProvider>
  );
}