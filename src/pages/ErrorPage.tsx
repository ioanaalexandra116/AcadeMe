import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    setTimeout(() => {
        navigate('/');
    }, 3000);

    return (
            <h1 color="#F987AF">
                404 not found 😞
            </h1>
    );
};

export default ErrorPage;