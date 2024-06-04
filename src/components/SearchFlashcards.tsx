import {
  getCategories,
  getSecondCategories,
  getFlashcardSetsIdsByCategory,
  getAllFlashcardSetsIds,
  getFlashcardSetsIdsByTitle,
} from "@/firebase/firestore";
import { useEffect, useState, useRef } from "react";
import arrwRight from "@/assets/arrow-right.svg";
import xRemove from "@/assets/x-remove.svg";
import Menu from "@/assets/menu.svg";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Post from "./Post";
import styled, { keyframes } from "styled-components";
import SearchFlashcardsBackground from "@/assets/search-background.svg";
import { useLocation } from "react-router-dom";
import RemoveFilter from "@/assets/remove-filter.svg";
import Loading from "./Loading";

const SlideIn = keyframes`
  0% {
    opacity: 1;
    transform: translateX(-280px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const SlideOut = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 1;
    transform: translateX(-280px);
  }
`;

const AnimatedCard = styled.div<{ openMenu: boolean }>`
  width: 280px;
  height: calc(100vh - 3.2rem);
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  animation: ${({ openMenu }) => (openMenu ? SlideIn : SlideOut)} 0.5s forwards;
  visibility: visible;
  transition: visibility 0s linear
    ${({ openMenu }) => (openMenu ? "0s" : "0.5s")};
  pointer-events: ${({ openMenu }) => (openMenu ? "auto" : "none")};
  opacity: ${({ openMenu }) => (openMenu ? "1" : "0")};
  z-index: 10;
  position: fixed;
  background-color: "#FFFFFF";
  backdrop-filter: blur(4px);
`;

const AnimatedOpenMenu = styled.div<{ openMenu: boolean }>`
  animation: ${({ openMenu }) => (openMenu ? SlideIn : SlideOut)} 0.5s forwards;
  visibility: visible;
  transition: visibility 0s linear
    ${({ openMenu }) => (openMenu ? "0s" : "0.5s")};
  position: fixed;
  left: 280px;
  z-index: 10;
  background-color: "#FFFFFF";
  backdrop-filter: blur(3px);
`;

export const SearchFlashcards = () => {
  const location = useLocation();
  const [categories, setCategories] = useState<string[]>([]);
  const [components, setComponents] = useState<
    {
      arrowPressed: boolean;
      title: string;
      subcategories: {
        arrowPressed: boolean;
        title: string;
        subcategories: string[];
      }[];
    }[]
  >([]);
  const [categsFromUrl, setCategsFromUrl] = useState<string[]>([]);
  const [selectedFromUrl, setSelectedFromUrl] = useState<string | null>(null);
  const [chosenCategory, setChosenCategory] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(true);
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [hovredParent, setHoveredParent] = useState<string | null>(null);
  const [hoveredImg, setHoveredImg] = useState<boolean>(false);
  const [currentComponentTitle, setCurrentComponentTitle] = useState<
    string | null
  >(null);
  const [flashcardSets, setFlashcardSets] = useState<string[]>([]);
  const [searchInTitle, setSearchInTitle] = useState("");
  const [hoverRemoveFilter, setHoverRemoveFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (buttonRef.current) buttonRef.current.click();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categories = searchParams.get("categories")?.split(",") || [];
    const selected = searchParams.get("selected");

    setCategsFromUrl(categories);
    console.log("categories: ", categories);
    setSelectedFromUrl(selected);
    setChosenCategory(selected);
    if (selected == categories[1]) {
      setParentCategory(categories[0]);
    } else if (selected == categories[2]) {
      setParentCategory(categories[1]);
    }
    setCurrentComponentTitle(selected);
  }, [location.search]);

  useEffect(() => {
    console.log("reading categories");
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("reading subcategories");
    const fetchSubcategories = async () => {
      try {
        const updatedComponents = await Promise.all(
          categories.map(async (category) => {
            const firebaseSubcategories = await getSecondCategories(category);

            if (!firebaseSubcategories) return null;

            let subcategories: {
              arrowPressed: boolean;
              title: string;
              subcategories: string[];
            }[] = [];

            if (Array.isArray(firebaseSubcategories)) {
              // Handle array of subcategories
              subcategories = firebaseSubcategories.map((subcat, index) => ({
                arrowPressed:
                  categsFromUrl.includes(category) &&
                  categsFromUrl.includes(`${index}`) &&
                  `${index}` != categsFromUrl[0]
                    ? true
                    : false,
                title: `${index}`, // Using index as title
                subcategories: subcat,
              }));
            } else {
              // Handle object of subcategories
              subcategories = Object.keys(firebaseSubcategories).map((key) => ({
                arrowPressed:
                  categsFromUrl.includes(category) &&
                  categsFromUrl.includes(key) &&
                  (selectedFromUrl == categsFromUrl[1] || key == parentCategory)
                    ? true
                    : false,
                title: key,
                subcategories: firebaseSubcategories[key],
              }));
            }

            return {
              arrowPressed: categsFromUrl.includes(category) ? true : false,
              title: category,
              subcategories: subcategories,
            };
          })
        );

        // Filter out null entries from updatedComponents
        const filteredComponents = updatedComponents.filter(
          (component) => component !== null
        );

        // Ensure filteredComponents is not empty before setting state
        if (filteredComponents.length > 0) {
          setComponents(
            filteredComponents as {
              arrowPressed: boolean;
              title: string;
              subcategories: {
                arrowPressed: boolean;
                title: string;
                subcategories: string[];
              }[];
            }[]
          );
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (categories.length > 0) {
      fetchSubcategories();
    }
  }, [categories]);

  const toggleArrow = (title: string) => {
    const updatedComponents = components.map((component) =>
      component.title === title
        ? { ...component, arrowPressed: !component.arrowPressed }
        : component
    );
    setComponents(updatedComponents);
  };

  useEffect(() => {
    if (chosenCategory) {
      console.log(chosenCategory);
    } else {
      const fetchAllFlashcardSets = async () => {
        try {
          const fetchedFlashcardSets = await getAllFlashcardSetsIds();
          setFlashcardSets(fetchedFlashcardSets.reverse());
          setLoading(false);
        } catch (error) {
          console.error("Error fetching flashcard sets:", error);
        }
      };
      fetchAllFlashcardSets();
      return;
    }

    const fetchFlashcardSets = async () => {
      try {
        const fetchedFlashcardSets = await getFlashcardSetsIdsByCategory(
          chosenCategory
        );
        setFlashcardSets(fetchedFlashcardSets.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      }
    };

    fetchFlashcardSets();
  }, [chosenCategory]);

  const toggleArrowSubcategory = (title: string, subcategory: string) => {
    const updatedComponents = components.map((component) =>
      component.title === title
        ? {
            ...component,
            subcategories: component.subcategories.map((subcat) =>
              subcat.title === subcategory
                ? { ...subcat, arrowPressed: !subcat.arrowPressed }
                : subcat
            ),
          }
        : component
    );
    setComponents(updatedComponents);
  };

  const handleTitleMouseEnter = (title: string) => {
    setHoveredTitle(title);
  };

  const handleTitleMouseLeave = () => {
    setHoveredTitle(null);
  };

  const handleImgMouseEnter = () => {
    setHoveredImg(true);
  };

  const handleImgMouseLeave = () => {
    setHoveredImg(false);
  };

  const handleSearch = async () => {
    try {
      if (!searchInTitle) {
        if (!chosenCategory) {
          const fetchedFlashcardSets = await getAllFlashcardSetsIds();
          setFlashcardSets(fetchedFlashcardSets.reverse());
        } else {
          const fetchedFlashcardSets = await getFlashcardSetsIdsByCategory(
            chosenCategory
          );
          setFlashcardSets(fetchedFlashcardSets.reverse());
        }
      } else {
        const fetchedFlashcardSets = await getFlashcardSetsIdsByTitle(
          searchInTitle,
          chosenCategory ? chosenCategory : ""
        );
        setFlashcardSets(fetchedFlashcardSets.reverse());
      }
    } catch (error) {
      console.error("Error fetching flashcard sets:", error);
    }
  };

  const HandleRemoveFilter = () => {
    setChosenCategory(null);
    setParentCategory(null);
    const fetchAllFlashcardSets = async () => {
      try {
        const fetchedFlashcardSets = await getAllFlashcardSetsIds();
        setFlashcardSets(fetchedFlashcardSets.reverse());
        console.log(fetchedFlashcardSets);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      }
    };
    fetchAllFlashcardSets();
  };

  return loading ? (
    <Loading />
  ) : (
    <div
      className="flex flex-col screen-height screen-width"
      style={{
        backgroundImage: `url(${SearchFlashcardsBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "repeat",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{ paddingTop: "3.2rem", maxWidth: "100vw", overflowX: "hidden" }}
        className="flex flex-row max-w-full"
      >
        <AnimatedCard openMenu={openMenu} className="shadow-xl">
          <div style={{ paddingTop: "20px" }}>
            {components.map((component) => (
              <div key={component.title}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={() => setCurrentComponentTitle(component.title)}
                >
                  {component.title != "Trivia" && (
                    <Button
                      style={{
                        width: "30px",
                        height: "36px",
                        backgroundColor:
                          hoveredImg &&
                          currentComponentTitle === component.title
                            ? "#EAF0EC"
                            : "transparent",
                        boxShadow: "none",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                      }}
                      onClick={() => toggleArrow(component.title)}
                      onMouseEnter={handleImgMouseEnter}
                      onMouseLeave={handleImgMouseLeave}
                    >
                      <img
                        src={arrwRight}
                        alt="arrow"
                        style={{
                          width: "20px",
                          height: "10px",
                          transform: component.arrowPressed
                            ? "rotate(90deg)"
                            : "none",
                        }}
                      />
                    </Button>
                  )}
                  <h3
                    style={{
                      color:
                        chosenCategory === component.title
                          ? "rgb(56 189 248)"
                          : "black",
                      backgroundColor:
                        hoveredTitle === component.title &&
                        chosenCategory !== component.title
                          ? "#EAF0EC"
                          : "transparent",
                      borderRadius: "10px",
                      paddingRight: "12px",
                      paddingLeft: "12px",
                      paddingBottom: "6px",
                      paddingTop: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (component.arrowPressed === false) {
                        toggleArrow(component.title);
                      }
                      setChosenCategory(component.title);
                    }}
                    onMouseEnter={() => handleTitleMouseEnter(component.title)}
                    onMouseLeave={handleTitleMouseLeave}
                  >
                    {component.title}
                  </h3>
                </div>
                {component.arrowPressed && (
                  <ul style={{ paddingLeft: "20px" }}>
                    {component.subcategories.map((subcat) => (
                      <li key={subcat.title + component.title}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                          }}
                          onMouseEnter={() =>
                            setCurrentComponentTitle(subcat.title)
                          }
                          onMouseLeave={() => setCurrentComponentTitle(null)}
                        >
                          <Button
                            style={{
                              width: "30px",
                              height: "36px",
                              backgroundColor:
                                hoveredImg &&
                                currentComponentTitle === subcat.title
                                  ? "#EAF0EC"
                                  : "transparent",
                              boxShadow: "none",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "4px",
                            }}
                            onClick={() =>
                              toggleArrowSubcategory(
                                component.title,
                                subcat.title
                              )
                            }
                            onMouseEnter={handleImgMouseEnter}
                            onMouseLeave={handleImgMouseLeave}
                          >
                            <img
                              src={arrwRight}
                              alt="arrow"
                              style={{
                                width: "20px",
                                height: "10px",
                                transform: subcat.arrowPressed
                                  ? "rotate(90deg)"
                                  : "none",
                              }}
                            />
                          </Button>
                          <h3
                            style={{
                              color:
                                chosenCategory === subcat.title
                                  ? "rgb(56 189 248)"
                                  : "black",
                              backgroundColor:
                                hoveredTitle === subcat.title &&
                                chosenCategory !== subcat.title
                                  ? "#EAF0EC"
                                  : "transparent",
                              borderRadius: "10px",
                              paddingRight: "12px",
                              paddingLeft: "12px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (subcat.arrowPressed === false) {
                                toggleArrowSubcategory(
                                  component.title,
                                  subcat.title
                                );
                              }
                              setChosenCategory(subcat.title);
                              setParentCategory(component.title);
                            }}
                            onMouseEnter={() =>
                              handleTitleMouseEnter(subcat.title)
                            }
                            onMouseLeave={handleTitleMouseLeave}
                          >
                            {subcat.title}
                          </h3>
                        </div>
                        {subcat.arrowPressed && (
                          <ul style={{ paddingLeft: "40px" }}>
                            {subcat.subcategories.map((subsubcat) => (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  padding: "4px",
                                  borderRadius: "4px",
                                }}
                                key={subsubcat}
                              >
                                <li
                                  style={{
                                    display: "flex",
                                    cursor: "pointer",
                                    paddingRight: "12px",
                                    paddingLeft: "12px",
                                    paddingBottom: "6px",
                                    paddingTop: "6px",
                                    borderRadius: "10px",
                                    color:
                                      chosenCategory === subsubcat &&
                                      parentCategory === subcat.title
                                        ? "rgb(56 189 248)"
                                        : "black",
                                    backgroundColor:
                                      hoveredTitle === subsubcat &&
                                      chosenCategory !== subsubcat &&
                                      hovredParent === subcat.title
                                        ? "#EAF0EC"
                                        : "transparent",
                                  }}
                                  key={subsubcat + subcat.title}
                                  onClick={() => {
                                    setChosenCategory(subsubcat);
                                    setParentCategory(subcat.title);
                                  }}
                                  onMouseEnter={() => {
                                    handleTitleMouseEnter(subsubcat);
                                    setHoveredParent(subcat.title);
                                  }}
                                  onMouseLeave={handleTitleMouseLeave}
                                >
                                  {subsubcat}
                                </li>
                              </div>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {chosenCategory && (
            <Button
              style={{
                backgroundColor: hoverRemoveFilter ? "#EAF0EC" : "transparent",
                boxShadow: "none",
                position: "fixed",
                top: "5px",
                right: "5px",
                color: "black",
                padding: "10px",
              }}
              onClick={HandleRemoveFilter}
              onMouseEnter={() => setHoverRemoveFilter(true)}
              onMouseLeave={() => setHoverRemoveFilter(false)}
            >
              <img
                src={RemoveFilter}
                alt="remove filter"
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </Button>
          )}
        </AnimatedCard>
        <AnimatedOpenMenu openMenu={openMenu}>
          <Button
            onClick={() => setOpenMenu(!openMenu)}
            style={{
              backgroundColor: "transparent", // Fix typo from "tarnsparent" to "transparent"
              border: "0.5px solid #e5e7eb",
              borderRadius: "5px",
              backdropFilter: "blur(5px)", // Apply backdrop filter to the button
              padding: "10px", // Adjust padding for better button appearance
            }}
            className="shadow-md"
          >
            <img
              src={Menu}
              alt="menu"
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </Button>
        </AnimatedOpenMenu>
        <div
          className="flex flex-col w-full pt-8"
          style={{
            width: openMenu ? `calc(100vw - 280px)` : "100vw", // Adjust width based on openMenu state
            position: "relative",
            left: openMenu ? "280px" : "0px",
          }}
        >
          <div className="flex justify-center items-center flex-row m-auto space-x-4 pt-4 pb-4">
            <div style={{ position: "relative", display: "inline-block" }}>
              <Input
                placeholder="Search flashcard set by title"
                type="text"
                id="search"
                value={searchInTitle}
                onChange={(e) => setSearchInTitle(e.target.value)}
                style={{
                  width: "320px",
                  backgroundColor: "#FFFFFF",
                  border: "0.5px solid #AA7D8C",
                  paddingRight: "30px",
                }}
              />
              <img
                src={xRemove}
                alt="remove"
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onClick={() => {
                  setSearchInTitle("");
                  HandleRemoveFilter();
                }}
              />
            </div>
            <Button
              style={{
                backgroundColor: "#F987AF",
                color: "#FFFFFF",
              }}
              onClick={handleSearch}
              ref={buttonRef}
            >
              Search
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center w-full allign-center">
            {flashcardSets.length === 0 ? (
              <h1
                className="text-4xl font-bold text-black contoured-text"
                style={{
                  color: "#f987af",
                  textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "calc(100vh - 8rem)",
                }}
              >
                No flashcard sets found
              </h1>
            ) : (
              <div
                className={`flex flex-wrap justify-center items-center pt-8`}
              >
                {flashcardSets.map((flashcardSetId) => (
                  <div key={flashcardSetId} className="flex justify-center">
                    <Post flashcardSetId={flashcardSetId} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFlashcards;
