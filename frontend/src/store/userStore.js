import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const userStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            setUser: (userData) => set({ user: userData }),
            setToken: (token) => set({ token: token }),
            clearUser: () => set({ user: null, token: null }),
            clearToken: () => set({ token: null })
        }),
        {
            name: 'user-storage',  // LocalStorage me ye key ka naam hoga
            // getStorage:()=>localStorage// Yeh define karta hai ki data kaha save hoga
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default userStore;
