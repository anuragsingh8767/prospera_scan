import { useState } from 'react';

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const handleSignUp = async (userData) => {
        setLoading(true);
        setApiError(null);

        try {
            const response = await fetch('http://localhost:5000/v1/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorData = await response.json();
                setApiError(errorData.message || 'Signup failed');
                return { success: false, errorData };
            }
        } catch (error) {
            setApiError('Signup failed. Please try again later.');
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    return { handleSignUp, loading, apiError };
};
