export const useLogin = () => {
    const login = async (email, password) => {
        
        try {
            const response = await fetch('http://localhost:5000/v1/user/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
// console.log(response,'response');

            if (response.ok) {
                const data = await response.json();
                console.log(data,'data');
                sessionStorage.setItem('authToken', data.token);
                return { success: true, data };
            } else {
                const errorData = await response.json();
                      console.log(errorData,'errorData');
                return { errorData};
            }
        } catch (err) {
            return {err};
        }
    };

    return { login };
};
