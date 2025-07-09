import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';

export const UserPlanContext = createContext();

export const UserPlanProvider = ({ children }) => {
    const [userPlanExpirated, setUserPlanExpirated] = useState(null);
    const [userPlan, setUserPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldShowPromotions, setShouldShowPromotions] = useState(false);
    const [shouldUserUsePremiumFeatures, setShouldUserUsePremiumFeatures] = useState(false);

    const { user } = useAuthContext();

    useEffect(() => {
        if (!user) {
            setUserPlanExpirated(null);
            setUserPlan([]);
            setIsLoading(false);
            setShouldShowPromotions(false);
            setShouldUserUsePremiumFeatures(false);
            return;
        }
    }, [user]);

    return (
        <UserPlanContext.Provider value={{
            userPlanExpirated,
            setUserPlanExpirated,
            userPlan,
            setUserPlan,
            isLoading,
            setIsLoading,
            shouldShowPromotions,
            setShouldShowPromotions,
            shouldUserUsePremiumFeatures,
            setShouldUserUsePremiumFeatures
        }}>
            {children}
        </UserPlanContext.Provider>
    );
};

export const useUserPlan = () => {
    return useContext(UserPlanContext);
};