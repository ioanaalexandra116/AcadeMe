import Avatar from "@/components/Avatar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { getFlashcardSetsOfUser } from "@/firebase/firestore";
import Post from "@/components/Post";
import DotsBackground from "@/components/DotsBackground";
const Profile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [flashcardSets, setFlashcardSets] = useState<string[]>([]);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchFlashcardSets = async () => {
      const flashcardSets = await getFlashcardSetsOfUser(user.uid);
      setFlashcardSets(flashcardSets);
      console.log(flashcardSets);
    };

    fetchFlashcardSets();
  }, [user]);

  return (
    <div className="flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <DotsBackground/>
      </div>
    <div className="flex flex-col items-center pt-16">
      {flashcardSets.map((flashcardSetId) => (
        <div style={{ marginBottom: '1.5rem', zIndex: 1 }}>
          <Post key={flashcardSetId} flashcardSetId={flashcardSetId} />
        </div>
      ))}
    </div>
    </div>
  );
};

export default Profile;
