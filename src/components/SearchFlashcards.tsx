import { Card } from "./ui/card";
import { getCategories, getSecondCategories } from "@/firebase/firestore";
import { useEffect, useState } from "react";
import arrwRight from "@/assets/arrow-right.svg";
import Menu from "@/assets/menu.svg";
import { Button } from "./ui/button";

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

  useEffect(() => {
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
    }
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

  return (
    <div style={{ paddingTop: "3rem" }} className="flex">
      {openMenu && (
        <Card
        style={{
            width: "250px",
            height: "calc(100vh - 3rem)",
            overflowY: "auto",
            borderRadius: "8px",
          }}

          className="rounded shadow-xl"
        >
          <div>
            {components.map((component) => (
              <div key={component.title}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {component.title != "Trivia" && (
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
                      onClick={() => toggleArrow(component.title)}
                    />
                  )}
                  <h3
                    style={{
                      color:
                        chosenCategory === component.title
                          ? "rgb(56 189 248)"
                          : "black",
                    }}
                    onClick={() => setChosenCategory(component.title)}
                  >
                    {component.title}
                  </h3>
                </div>
                {component.arrowPressed && (
                  <ul style={{ paddingLeft: "20px" }}>
                    {component.subcategories.map((subcat) => (
                      <li key={subcat.title}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "4px",
                          }}
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
                            onClick={() =>
                              toggleArrowSubcategory(
                                component.title,
                                subcat.title
                              )
                            }
                          />
                          <h3
                            style={{
                              color:
                                chosenCategory === subcat.title
                                  ? "rgb(56 189 248)"
                                  : "black",
                            }}
                            onClick={() => setChosenCategory(subcat.title)}
                          >
                            {subcat.title}
                          </h3>
                        </div>
                        {subcat.arrowPressed && (
                          <ul style={{ paddingLeft: "40px" }}>
                            {subcat.subcategories.map((subsubcat) => (
                              <li
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  padding: "8px",
                                  borderRadius: "4px",
                                  color:
                                    chosenCategory === subsubcat
                                      ? "rgb(56 189 248)"
                                      : "black",
                                }}
                                key={subsubcat}
                                onClick={() => setChosenCategory(subsubcat)}
                              >
                                {subsubcat}
                              </li>
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
        </Card>
      )}
      <Button
        onClick={() => setOpenMenu(!openMenu)}
        style={{
          backgroundColor: "transparent",
          border: "none",
          borderTopLeftRadius: "5px",
          borderBottomLeftRadius: "5px",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
        }}
      >
        <img src={Menu} alt="menu" style={{ width: "20px", height: "20px" }} />
      </Button>
    </div>
  );
};

export default SearchFlashcards;
