import { useState } from 'react';
import { AppProvider, useApp } from './app/AppState';
import { HomeScreen } from './features/home/HomeScreen';
import { ParentArea } from './features/parent/ParentArea';
import { Setup } from './features/parent/Setup';
import { SessionFlow } from './features/session/SessionFlow';

type Route = 'home' | 'session' | 'parent';

function Router() {
  const { data } = useApp();
  const [route, setRoute] = useState<Route>('home');

  if (!data.profile || !data.guardianConsentAt) return <Setup />;
  if (route === 'session') return <SessionFlow onExit={() => setRoute('home')} />;
  if (route === 'parent') return <ParentArea onExit={() => setRoute('home')} />;
  return <HomeScreen onStart={() => setRoute('session')} onGrownUp={() => setRoute('parent')} />;
}

export function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
