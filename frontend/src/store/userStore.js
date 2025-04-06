import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
const userStore = create(
    persist(
        (set)=>({
            user:null,
            setUser:(userData)=>set({user:userData}),
            clearUser:()=>set({user:null})
        }),
        {
            name:'user-storage',  // LocalStorage me ye key ka naam hoga
            // getStorage:()=>localStorage// Yeh define karta hai ki data kaha save hoga
            storage: createJSONStorage(() => localStorage)
        }
    )
)
 

 export default userStore;
