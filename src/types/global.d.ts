export {};

declare global {
  interface Window {
    api: {
      saveGame: (data: any) => void;
      loadGame: () => Promise<any>;
      saveGameToDB: (data: {
        money: number;
        items: any[];
        customerData: any;
        petList: any[];
      }) => Promise<{ success: boolean; error?: string }>;
      loadGameFromDB: () => Promise<{
        money: number;
        items: any[];
        customerData: any;
        petList: any[];
      }>;
      greenworks: any;
      exitApp: () => void;
    };
  }
}
