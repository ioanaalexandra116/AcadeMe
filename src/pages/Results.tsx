import { getActivities } from "@/firebase/firestore";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@/context";
import { useState, useContext, useEffect } from "react";

const Results = () => {
    const [scores, setScores] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get("flashcardSetId");
    const { user, userLoading } = useContext(AuthContext);

    if (!user || userLoading) {
        return;
    }

    if (!postId) {
        return;
    }

    useEffect(() => {
        if (!userLoading) {
            getActivities(user.uid, postId).then((data) => {
                setScores(data);
            });
        }
    }, [userLoading, user, postId]);

    return (
        <div className="pt-16">
            <h1>Results</h1>
            <div>
                {scores.map((score, index) => {
                    return (
                        <div key={index}>
                            <p>Score: {score}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Results;