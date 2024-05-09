import SearchUser from "@/components/SearchUser";
import Background from "@/assets/search-background.svg";

const SearchUserPage = () => {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundAttachment: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="pt-16">
            <SearchUser />
          </div>
        </div>
      </div>
    );
  };

export default SearchUserPage;
