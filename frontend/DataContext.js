// DataContext.js

import { createContext } from "react";

export const DataContext = createContext({
  refreshData: false, // flag to denote if a refresh is required
  setRefreshData: () => {}, // function to toggle the flag
});
