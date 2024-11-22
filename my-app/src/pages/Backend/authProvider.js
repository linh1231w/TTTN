import {jwtDecode} from 'jwt-decode';
const authProvider = {
    login: ({ username, password }) => {
        const request = new Request('http://localhost:5011/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error('Tài Khoản mật khẩu không đúng');
                }
                return response.json();
            })
            .then(({ token }) => {
                // Giải mã token để kiểm tra roles
                const decodedToken = jwtDecode(token);
                console.log(decodedToken)
            
                if (decodedToken.role && decodedToken.role.includes('Admin')) {
                    localStorage.setItem('authToken', token);
                } else {
                    throw { message: 'Bạn không có đủ quyền truy cập vào hệ thống.' };
                }
            });
    },
    logout: () => {
        localStorage.removeItem('authToken');
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('authToken') ? Promise.resolve() : Promise.reject();
    },
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('authToken');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.resolve(),
};

export default authProvider;