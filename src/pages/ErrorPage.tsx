import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ErrorPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 3000);
    }, [navigate]);

    return (
            <h1 color="#F987AF">
                404 not found 😞
            </h1>
    );
};

export default ErrorPage;