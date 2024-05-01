import {
  getCategories,
  getSecondCategories,
  getFlashcardSetsIdsByCategory,
  getAllFlashcardSetsIds,
} from "@/firebase/firestore";
import { useEffect, useState } from "react";
import arrwRight from "@/assets/arrow-right.svg";
import Menu from "@/assets/menu.svg";
import { Button } from "./ui/button";
import Post from "./Post";
import styled, { keyframes } from "styled-components";

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
  height: calc(100vh - 3.1rem);
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  animation: ${({ openMenu }) => (openMenu ? SlideIn : SlideOut)} 0.5s forwards;
  visibility: visible;
  transition: visibility 0s linear
    ${({ openMenu }) => (openMenu ? "0s" : "0.5s")};
  pointer-events: ${({ openMenu }) => (openMenu ? "auto" : "none")};
  opacity: ${({ openMenu }) => (openMenu ? "1" : "0")};
  z-index: 100;
  position: fixed;
`;

const AnimatedOpenMenu = styled.div<{ openMenu: boolean }>`
  animation: ${({ openMenu }) => (openMenu ? SlideIn : SlideOut)} 0.5s forwards;
  visibility: visible;
  transition: visibility 0s linear
    ${({ openMenu }) => (openMenu ? "0s" : "0.5s")};
  position: fixed;
  left: 280px;
  z-index: 100;
`;

export const SearchFlashcards = () => {
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
                arrowPressed: false,
                title: `${index}`, // Using index as title
                subcategories: subcat,
              }));
            } else {
              // Handle object of subcategories
              subcategories = Object.keys(firebaseSubcategories).map((key) => ({
                arrowPressed: false,
                title: key,
                subcategories: firebaseSubcategories[key],
              }));
            }

            return {
              arrowPressed: false,
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
          setFlashcardSets(fetchedFlashcardSets);
          console.log(fetchedFlashcardSets);
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
        setFlashcardSets(fetchedFlashcardSets);
        console.log(fetchedFlashcardSets);
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

  return (
    <div style={{ paddingTop: "3.1rem",
    maxWidth: "100vw",
    overflowX: "hidden",

     }} className="flex flex-row max-w-full">
      <AnimatedCard openMenu={openMenu} className="shadow-xl">
        <div>
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
                        hoveredImg && currentComponentTitle === component.title
                          ? "#F3F3F3"
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
                        ? "#F3F3F3"
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
                                ? "#F3F3F3"
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
                                ? "#F3F3F3"
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
                                      ? "#F3F3F3"
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
      </AnimatedCard>
      <AnimatedOpenMenu openMenu={openMenu}>
        <Button
          onClick={() => setOpenMenu(!openMenu)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            position: "relative",
            zIndex: 100,
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
        className={`flex flex-wrap justify-center items-center`}
        style={{
          width: openMenu ? `calc(100vw - 280px)` : "100vw", // Adjust width based on openMenu state
          position: "relative",
          left: openMenu ? "280px" : "0px",
        }}
      >
        {flashcardSets.map((flashcardSetId) => (
          <div key={flashcardSetId} className="p-8 flex justify-center">
            <Post flashcardSetId={flashcardSetId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFlashcards;
