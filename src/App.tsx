import { DesignCanvas } from "./components/DesignCanvas";
import { Dashboard } from "./components/Dashboard";
import { useDesignScale } from "./scaling/useDesignScale";

export default function App() {
  useDesignScale();

  return (
    <DesignCanvas>
      <Dashboard />
    </DesignCanvas>
  );
}
