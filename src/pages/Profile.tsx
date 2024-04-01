import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { getFlashcardSetsOfUser } from "@/firebase/firestore";
import Post from "@/components/Post";
import DotsBackground from "@/components/DotsBackground";
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [flashcardSets, setFlashcardSets] = useState<string[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchFlashcardSets = async () => {
      if (userId) {
        const sets = await getFlashcardSetsOfUser(userId);
        setFlashcardSets(sets);
        return;
      }
    };

    fetchFlashcardSets();
  }, [user]);

  return (
    <div className="flex flex-col relative items-center justify-center">
      <div className="absolute inset-0 z-1">
        <DotsBackground />
      </div>
      <div className={`flex flex-wrap justify-center items-center pt-16 `}>
        {flashcardSets.map((flashcardSetId) => (
          <div key={flashcardSetId} className="p-8 flex justify-center">
            <Post flashcardSetId={flashcardSetId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
