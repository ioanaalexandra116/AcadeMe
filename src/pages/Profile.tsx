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
  const [numColumns, setNumColumns] = useState(3); // Default to 3 columns

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setNumColumns(1);
      } else if (window.innerWidth <= 1300 && window.innerWidth > 768) {
        setNumColumns(2);
      } else {
        setNumColumns(3);
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    };

    fetchFlashcardSets();
  }, [user]);

  const columnWidth = `${100 / numColumns}%`;

  return (
    <div className="flex flex-col relative items-center justify-center">
      <div className="absolute inset-0 z-1">
        <DotsBackground />
      </div>
      <div className={`flex flex-wrap justify-center items-center pt-16 `}>
        {flashcardSets.map((flashcardSetId) => (
          <div key={flashcardSetId} style={{ width: columnWidth }} className="p-8 flex justify-center">
            <Post flashcardSetId={flashcardSetId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
