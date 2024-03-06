import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context';
import { Progress } from "@/components/ui/progress"

const Privateroute = () => {
    const { user, userLoading } = useContext(AuthContext);
    if (!userLoading && !user) {
        return <Navigate to="/login" />;
    }
    return userLoading ? (
        <Progress value={33} />
    ) : (
        <>
            {/* <Navbar /> */}
            <Outlet />
        </>
    );
};

export default Privateroute;