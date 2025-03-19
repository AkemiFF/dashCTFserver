import { authFetch } from "@/lib/api";
import { BASE_URL } from "@/lib/host";

// Service pour interagir avec l'API des cours
export const UserApiService = {
    fetchUserData: async () => {
        try {
            const response = await authFetch(`${BASE_URL}/api/auth/user/`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
}