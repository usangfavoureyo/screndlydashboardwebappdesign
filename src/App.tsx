import { ThemeProvider } from "./components/ThemeProvider";
import { TMDbPostsProvider } from "./contexts/TMDbPostsContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { RSSFeedsProvider } from "./contexts/RSSFeedsContext";
import { VideoStudioTemplatesProvider } from "./contexts/VideoStudioTemplatesContext";
import { UndoProvider } from "./components/UndoContext";
import { AppContent } from "./components/AppContent";

export default function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}